const db = require('better-sqlite3')('anime.db');
const row = db.prepare('SELECT content FROM articles WHERE id = 931').get();
if (!row) {
    console.log('Article 931 not found');
} else {
    const lines = row.content.split('\n');
    lines.forEach(line => {
        if (line.match(/!\[.*\]\(.*\)/)) {
            console.log(line);
        }
    });
}
