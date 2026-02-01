const db = require('better-sqlite3')('anime.db');

function calculateSeasonNumber(baseTitle, entries) {
    // Sort by aired_from date
    entries.sort((a, b) => {
        const da = new Date(a.aired_from || '1970-01-01');
        const db = new Date(b.aired_from || '1970-01-01');
        return da - db;
    });

    // Rename
    const instructions = [];

    // Check if dates are distinct enough to be seasons
    // If dates are very close (within 3 months), they might be duplicates

    for (let i = 0; i < entries.length; i++) {
        const current = entries[i];

        // Compare with previous to check for duplicates
        if (i > 0) {
            const prev = entries[i - 1];
            const d1 = new Date(current.aired_from || '1970-01-01');
            const d2 = new Date(prev.aired_from || '1970-01-01');
            const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));

            if (diffDays < 90 && current.title === prev.title) {
                // Duplicate!
                console.log(`Potential duplicate found: [${current.mal_id}] ${current.title} vs [${prev.mal_id}] ${prev.title}`);
                // Delete the one with less info or just the current one
                instructions.push({ type: 'DELETE', id: current.mal_id });
                continue;
            }
        }

        // If not duplicate, assume it's a season (if count > 1)
        if (entries.length > 1) {
            const seasonNum = i + 1;
            let newTitle = current.title;

            // Don't rename Season 1 usually, unless we want strict "S1"
            // User said: "If season diff, write out season"
            if (seasonNum > 1) {
                // Check if title already has "Season" or "nd Season"
                if (!/Season|Part|第.+季/i.test(newTitle)) {
                    newTitle = `${newTitle} 第${seasonNum}季`;
                    instructions.push({ type: 'UPDATE', id: current.mal_id, title: newTitle });
                }
            }
        }
    }
    return instructions;
}

function main() {
    console.log('Scanning for duplicates/seasons...');
    const rows = db.prepare('SELECT * FROM anime ORDER BY title').all();

    // Group by Title (normalized)
    const groups = {};
    rows.forEach(r => {
        const norm = r.title.trim(); // Maybe lowercase? No, keep case sensitivity for now
        if (!groups[norm]) groups[norm] = [];
        groups[norm].push(r);
    });

    let updates = 0;
    let deletes = 0;

    for (const title in groups) {
        const entries = groups[title];
        if (entries.length > 1) {
            console.log(`Processing group: ${title} (${entries.length} entries)`);
            const ops = calculateSeasonNumber(title, entries);

            ops.forEach(op => {
                if (op.type === 'DELETE') {
                    db.prepare('DELETE FROM anime WHERE mal_id = ?').run(op.id);
                    console.log(`  Deleted ID ${op.id}`);
                    deletes++;
                } else if (op.type === 'UPDATE') {
                    db.prepare('UPDATE anime SET title = ? WHERE mal_id = ?').run(op.title, op.id);
                    console.log(`  Renamed ID ${op.id} to "${op.title}"`);
                    updates++;
                }
            });
        }
    }

    console.log(`Finished. Updated: ${updates}, Deleted: ${deletes}`);
}

main();
