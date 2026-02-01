const Database = require('better-sqlite3');
const db = new Database('anime.db');
const a875 = db.prepare('SELECT content FROM articles WHERE id = 875').get();
const a3 = db.prepare('SELECT content FROM articles WHERE id = 3').get();
console.log('--- REF ARTICLE 875 ---');
console.log(a875 ? a875.content : 'Article 875 NOT FOUND');
console.log('\n--- TARGET ARTICLE 3 ---');
console.log(a3 ? a3.content : 'Article 3 NOT FOUND');
