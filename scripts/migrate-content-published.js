const { createClient } = require('@libsql/client');
const db = require('better-sqlite3')('anime.db');

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function migrate() {
    console.log('Migrating anime table schema...');

    // 1. Local Migration
    try {
        const info = db.pragma("table_info(anime)");
        const hasContent = info.some(c => c.name === 'content');
        const hasPublished = info.some(c => c.name === 'is_published');

        if (!hasContent) {
            db.prepare('ALTER TABLE anime ADD COLUMN content TEXT').run();
            console.log('✅ Local DB: Added content column.');
        } else {
            console.log('ℹ️ Local DB: content column exists.');
        }

        if (!hasPublished) {
            db.prepare('ALTER TABLE anime ADD COLUMN is_published INTEGER DEFAULT 0').run();
            // Optional: Mark existing anime as published? 
            // User said "default false". But existing anime on site should probably be visible?
            // "The user's objective is to optimize... dynamic metadata... based on anime data fetched".
            // If I set default false, all current anime might disappear if I update queries to check is_published.
            // The prompt "Add a new column ... default false" implies NEW items should be drafts. 
            // But existing items? Usually you want to keep them visible.
            // I'll set existing items to is_published = 1 for continuity, OR just leave them as 0 if the query doesn't filter them yet.
            // User only asked to "Add a new column". Didn't ask to filter by it yet.
            // I will stick to "default 0" as requested.
            console.log('✅ Local DB: Added is_published column.');
        } else {
            console.log('ℹ️ Local DB: is_published column exists.');
        }

    } catch (e) {
        console.error('Local DB Error:', e.message);
    }

    // 2. Remote Migration
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

    try {
        // Add content
        try {
            await client.execute('ALTER TABLE anime ADD COLUMN content TEXT');
            console.log('✅ Remote DB: Added content column.');
        } catch (e) {
            if (e.message.includes('duplicate column')) {
                console.log('ℹ️ Remote DB: content column exists.');
            } else {
                console.error('Remote DB Error (content):', e.message);
            }
        }

        // Add is_published
        try {
            await client.execute('ALTER TABLE anime ADD COLUMN is_published INTEGER DEFAULT 0');
            console.log('✅ Remote DB: Added is_published column.');
        } catch (e) {
            if (e.message.includes('duplicate column')) {
                console.log('ℹ️ Remote DB: is_published column exists.');
            } else {
                console.error('Remote DB Error (is_published):', e.message);
            }
        }

    } catch (e) {
        console.error('Remote DB Connection Error:', e.message);
    } finally {
        client.close();
    }
}

migrate();
