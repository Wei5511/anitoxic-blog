// Debug: Check specific anime in Turso
import { createClient } from '@libsql/client';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function debug() {
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

    console.log('=== Debugging Turso Sync ===\n');

    // Check specific mal_ids we know should have Chinese titles
    const testIds = [4334, 5032, 5277, 5690, 6114]; // From our export

    console.log('Checking specific anime:');
    for (const malId of testIds) {
        const res = await client.execute({
            sql: 'SELECT mal_id, title, title_chinese FROM anime WHERE mal_id = ?',
            args: [malId]
        });

        if (res.rows.length > 0) {
            const anime = res.rows[0];
            console.log(`  ${anime.mal_id}: ${anime.title}`);
            console.log(`    Chinese: ${anime.title_chinese || '(NULL)'}`);
        } else {
            console.log(`  ${malId}: NOT FOUND`);
        }
    }

    // Get total anime count
    console.log('\nTotal anime:');
    const totalRes = await client.execute('SELECT COUNT(*) as count FROM anime');
    console.log(`  ${totalRes.rows[0].count} records`);

    // Check if any Chinese titles exist
    console.log('\nSearching for ANY Chinese titles...');
    const anyRes = await client.execute(`
    SELECT mal_id, title, title_chinese
    FROM anime
    LIMIT 1000
  `);

    const withChinese = anyRes.rows.filter(r => r.title_chinese);
    console.log(`Found ${withChinese.length} anime with Chinese titles`);

    if (withChinese.length > 0) {
        console.log('\nSamples:');
        withChinese.slice(0, 5).forEach(a => {
            console.log(`  ${a.mal_id}: ${a.title_chinese}`);
        });
    }

    client.close();
}

debug();
