const db = require('better-sqlite3')('anime.db');

const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(927);

if (article) {
    console.log('=== Article 927 Details ===');
    console.log('ID:', article.id);
    console.log('Title:', article.title);
    console.log('Category:', article.category);
    console.log('MyVideo URL:', article.myvideo_url);
    console.log('Image URL:', article.image_url);
    console.log('\n=== Content Preview (first 2000 chars) ===');
    console.log(article.content.substring(0, 2000));
    console.log('\n...');
} else {
    console.log('Article 927 not found');
}

db.close();
