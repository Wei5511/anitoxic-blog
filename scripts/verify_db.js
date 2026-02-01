const db = require('better-sqlite3')('anime.db');
const row = db.prepare("SELECT title, length(synopsis) as synopsis_len, url, staff FROM myvideo_library WHERE title = '葬送的芙莉蓮 第二季'").get();
console.log(JSON.stringify(row, null, 2));
