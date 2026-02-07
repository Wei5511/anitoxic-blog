const { createClient } = require('@libsql/client');
const db = require('better-sqlite3')('anime.db');

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function migrate() {
    console.log('Migrating is_recommended column...');

    // 1. Local Migration
    try {
        const info = db.pragma("table_info(articles)");
        const hasColumn = info.some(c => c.name === 'is_recommended');

        if (!hasColumn) {
            db.prepare('ALTER TABLE articles ADD COLUMN is_recommended INTEGER DEFAULT 0').run();
            // Migrate existing Categories to Recommended
            db.prepare("UPDATE articles SET is_recommended = 1 WHERE category IN ('編輯精選', '深度解析')").run();
            console.log('✅ Local DB Updated.');
        } else {
            console.log('ℹ️ Local DB already has is_recommended.');
        }
    } catch (e) {
        console.error('Local DB Error:', e.message);
    }

    // 2. Remote Migration
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

    try {
        try {
            await client.execute('ALTER TABLE articles ADD COLUMN is_recommended INTEGER DEFAULT 0');
            await client.execute("UPDATE articles SET is_recommended = 1 WHERE category IN ('編輯精選', '深度解析')");
            console.log('✅ Remote DB Updated.');
        } catch (e) {
            if (e.message.includes('duplicate column')) {
                console.log('ℹ️ Remote DB already has is_recommended.');
            } else {
                throw e;
            }
        }
    } catch (e) {
        console.error('Remote DB Error:', e.message);
    } finally {
        client.close();
    }
}

migrate();
