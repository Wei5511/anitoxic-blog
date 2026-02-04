// Add Chinese columns to Turso production database
import { createClient } from '@libsql/client';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function addChineseColumns() {
    console.log('=== Adding Chinese Columns to Turso ===\n');

    console.log('Connecting to Turso...');
    const client = createClient({
        url: TURSO_URL,
        authToken: TURSO_TOKEN
    });

    try {
        // Check current schema
        console.log('Checking anime table schema...');
        const schemaRes = await client.execute('PRAGMA table_info(anime)');
        const columns = schemaRes.rows.map(r => r.name);

        console.log(`Current columns: ${columns.join(', ')}\n`);

        // Add title_chinese if not exists
        if (!columns.includes('title_chinese')) {
            console.log('Adding title_chinese column...');
            await client.execute('ALTER TABLE anime ADD COLUMN title_chinese TEXT');
            console.log('✅ title_chinese column added');
        } else {
            console.log('ℹ️  title_chinese column already exists');
        }

        // Add synopsis_chinese if not exists
        if (!columns.includes('synopsis_chinese')) {
            console.log('Adding synopsis_chinese column...');
            await client.execute('ALTER TABLE anime ADD COLUMN synopsis_chinese TEXT');
            console.log('✅ synopsis_chinese column added');
        } else {
            console.log('ℹ️  synopsis_chinese column already exists');
        }

        // Verify
        console.log('\nVerifying schema...');
        const newSchemaRes = await client.execute('PRAGMA table_info(anime)');
        const newColumns = newSchemaRes.rows.map(r => r.name);

        console.log(`\nUpdated columns (${newColumns.length} total):`);
        newColumns.forEach(col => console.log(`  - ${col}`));

        console.log('\n✅ Schema update complete!');

    } finally {
        client.close();
    }
}

addChineseColumns()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
