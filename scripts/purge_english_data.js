const db = require('better-sqlite3')('anime.db');

// Delete Jikan data (ID < 200000) for years 2023, 2024, 2025, 2026
const years = [2023, 2024, 2025, 2026];
const ph = years.map(() => '?').join(',');

const stmt = db.prepare(`DELETE FROM anime WHERE mal_id < 200000 AND year IN (${ph})`);
const info = stmt.run(...years);

console.log(`Deleted ${info.changes} English entries.`);
