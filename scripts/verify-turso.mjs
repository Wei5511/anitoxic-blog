// Quick verification of Turso Chinese titles
import { createClient } from '@libsql/client';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function verify() {
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

    console.log('=== Verifying Turso Database ===\n');

    // Check count
    const countRes = await client.execute(`
    SELECT COUNT(*) as count 
    FROM anime 
    WHERE title_chinese IS NOT NULL AND title_chinese != ''
  `);

    console.log(`Chinese titles count: ${countRes.rows[0].count}\n`);

    // Get sample
    const sampleRes = await client.execute(`
    SELECT mal_id, title, title_chinese
    FROM anime
    WHERE title_chinese IS NOT NULL AND title_chinese != ''
    LIMIT 10
  `);

    console.log('Sample titles:');
    sampleRes.rows.forEach(r => {
        console.log(`  ${r.mal_id}: ${r.title} → ${r.title_chinese}`);
    });

    client.close();
}

verify();
