const db = require('better-sqlite3')('anime.db');
try {
    const a886 = db.prepare('SELECT * FROM articles WHERE id = 886').get();
    const a875 = db.prepare('SELECT * FROM articles WHERE id = 875').get();

    console.log('--- ARTICLE 886 ---');
    if (a886) {
        console.log(`Title: ${a886.title}`);
        console.log(`Content Preview: \n${a886.content.substring(0, 500)}`);
    } else {
        console.log('Article 886 NOT FOUND');
    }

    console.log('\n--- ARTICLE 875 ---');
    if (a875) {
        console.log(`Title: ${a875.title}`);
        console.log(`Content Preview: \n${a875.content.substring(0, 500)}`);
    } else {
        console.log('Article 875 NOT FOUND');
    }
} catch (e) {
    console.error(e);
}
