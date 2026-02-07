import { createClient } from '@libsql/client';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function verify() {
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    try {
        console.log('Checking remove DB columns...');
        // Try selecting the new columns
        await client.execute('SELECT sort_order, is_recommended FROM articles LIMIT 1');
        console.log('✅ Remote DB columns exist.');
    } catch (e) {
        if (e.message.includes('no such column')) {
            console.error('❌ Missing columns on remote DB:', e.message);
            process.exit(1);
        } else {
            console.error('⚠️ Unknown error:', e.message);
            // Maybe table empty? But columns should exist.
            if (e.message.includes('no such table')) {
                console.error('❌ Missing table articles');
                process.exit(1);
            }
        }
    } finally {
        client.close();
    }
}

verify();
