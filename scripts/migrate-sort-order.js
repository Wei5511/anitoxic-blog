const { createClient } = require('@libsql/client');
const db = require('better-sqlite3')('anime.db');

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function migrate() {
    console.log('Migrating sort_order column...');

    // 1. Local Migration
    try {
        const info = db.prepare("table_info(articles)").all();
        const hasColumn = info.some(c => c.name === 'sort_order');

        if (!hasColumn) {
            db.prepare('ALTER TABLE articles ADD COLUMN sort_order INTEGER DEFAULT 1000').run();
            console.log('✅ Local DB Updated.');
        } else {
            console.log('ℹ️ Local DB already has sort_order.');
        }
    } catch (e) {
        console.error('Local DB Error:', e.message);
    }

    // 2. Remote Migration
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

    try {
        // Since Turso doesn't support PRAGMA nicely via HTTP always, we just try ALTER TABLE.
        // If it fails (duplicate column), we catch it.
        try {
            await client.execute('ALTER TABLE articles ADD COLUMN sort_order INTEGER DEFAULT 1000');
            console.log('✅ Remote DB Updated.');
        } catch (e) {
            if (e.message.includes('duplicate column')) {
                console.log('ℹ️ Remote DB already has sort_order.');
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
