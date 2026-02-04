// Sync Chinese titles to Turso production database
import { createClient } from '@libsql/client';
import fs from 'fs';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function syncToTurso() {
    console.log('=== Syncing Chinese Titles to Turso ===\n');

    // Load exported data
    const data = JSON.parse(fs.readFileSync('chinese-titles-export.json', 'utf8'));
    console.log(`Loaded ${data.length} Chinese titles to sync\n`);

    // Connect to Turso
    console.log('Connecting to Turso...');
    const client = createClient({
        url: TURSO_URL,
        authToken: TURSO_TOKEN
    });

    // Check current status in Turso
    console.log('Checking current Turso database status...');
    const statusRes = await client.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN title_chinese IS NOT NULL AND title_chinese != '' THEN 1 ELSE 0 END) as with_chinese
    FROM anime
  `);

    const currentStatus = statusRes.rows[0];
    console.log(`Current Turso status:`);
    console.log(`  Total: ${currentStatus.total}`);
    console.log(`  With Chinese: ${currentStatus.with_chinese}\n`);

    // Update Turso with Chinese titles
    console.log('Updating Turso database...\n');

    let updated = 0;
    let failed = 0;

    for (let i = 0; i < data.length; i++) {
        const anime = data[i];

        try {
            await client.execute({
                sql: 'UPDATE anime SET title_chinese = ? WHERE mal_id = ?',
                args: [anime.title_chinese, anime.mal_id]
            });

            updated++;

            if ((i + 1) % 20 === 0 || i === data.length - 1) {
                console.log(`  Progress: ${i + 1}/${data.length} (${updated} updated, ${failed} failed)`);
            }

        } catch (error) {
            failed++;
            console.error(`  ❌ Error updating ${anime.mal_id}:`, error.message);
        }

        // Small delay to avoid overwhelming
        if (i % 10 === 0) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    // Check final status
    console.log('\n Verifying sync...');
    const finalRes = await client.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN title_chinese IS NOT NULL AND title_chinese != '' THEN 1 ELSE 0 END) as with_chinese
    FROM anime
  `);

    const finalStatus = finalRes.rows[0];

    console.log('\n=== Sync Complete ===');
    console.log(`Before: ${currentStatus.with_chinese} Chinese titles`);
    console.log(`After: ${finalStatus.with_chinese} Chinese titles`);
    console.log(`Added: +${finalStatus.with_chinese - currentStatus.with_chinese}`);
    console.log(`Success: ${updated}/${data.length} (${((updated / data.length) * 100).toFixed(1)}%)`);

    client.close();
}

syncToTurso()
    .then(() => {
        console.log('\n✅ Turso sync successful!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Sync failed:', error);
        process.exit(1);
    });
