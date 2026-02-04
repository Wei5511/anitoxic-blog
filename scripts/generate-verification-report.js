const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

console.log('📝 Generating Verification Report...');

const total = db.prepare('SELECT COUNT(*) as count FROM anime').get().count;

const years = db.prepare(`
    SELECT year, COUNT(*) as count 
    FROM anime 
    GROUP BY year 
    ORDER BY year DESC
`).all();

// Top 10 most common genres
const allAnime = db.prepare('SELECT genres FROM anime').all();
const genreCounts = {};
allAnime.forEach(row => {
    if (!row.genres) return;
    row.genres.split(',').forEach(g => {
        const tag = g.trim();
        genreCounts[tag] = (genreCounts[tag] || 0) + 1;
    });
});
const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

// Check potential issues (English tags remaining)
const englishTagRegex = /[a-zA-Z]{3,}/;
const unmapped = Object.keys(genreCounts).filter(g => englishTagRegex.test(g) && !['Ecchi', 'CGDCT', 'BL'].includes(g));

const report = `
# Database Expansion Verification Report

## Summary
- **Total Anime**: ${total}
- **Years Covered**: ${years.length > 0 ? `${years[years.length - 1].year} - ${years[0].year}` : 'N/A'}

## Statistics by Year
| Year | Count |
|------|-------|
${years.map(y => `| ${y.year} | ${y.count} |`).join('\n')}

## Top 20 Tags (Genres)
${sortedGenres.map(([tag, count]) => `- **${tag}**: ${count}`).join('\n')}

## Potential Issues
- **Unmapped English Tags**: ${unmapped.length > 0 ? unmapped.join(', ') : 'None detected'}

## Sample Entries (Newest)
${db.prepare('SELECT title, year, season, genres FROM anime ORDER BY year DESC, season ASC LIMIT 5').all().map(a => `- [${a.year} ${a.season}] **${a.title}**: ${a.genres}`).join('\n')}

## Sample Entries (Oldest)
${db.prepare('SELECT title, year, season, genres FROM anime ORDER BY year ASC, season ASC LIMIT 5').all().map(a => `- [${a.year} ${a.season}] **${a.title}**: ${a.genres}`).join('\n')}
`;

const reportPath = path.join(process.cwd(), 'verification_report.md');
fs.writeFileSync(reportPath, report);
console.log(`✅ Report saved to ${reportPath}`);
