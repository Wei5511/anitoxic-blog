const Database = require('better-sqlite3');
const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const LOCAL_DB_PATH = path.join(process.cwd(), 'anime.db');
const BATCH_SIZE = 50; // Reduced batch size for safety

async function migrate() {
    console.log('🚀 Starting migration (Schema + Data)...');

    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
        console.error('❌ Missing CREDENTIALS');
        process.exit(1);
    }

    const localDb = new Database(LOCAL_DB_PATH);
    const turso = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const tables = ['anime', 'articles', 'banners', 'settings', 'posts'];

    // 1. Sync Schema
    console.log('\n🏗️  Syncing Schema...');
    for (const table of tables) {
        try {
            // Get CREATE TABLE sql from local master
            const schema = localDb.prepare("SELECT sql FROM sqlite_schema WHERE type='table' AND name=?").get(table);
            if (schema && schema.sql) {
                console.log(`   Creating table ${table}...`);
                // Turso executes standard SQL
                await turso.execute(schema.sql);
            }
        } catch (e) {
            console.warn(`   ⚠️ Schema sync warning for ${table}:`, e.message);
        }
    }

    // 2. Sync Data
    console.log('\n📦 Syncing Data...');
    for (const table of tables) {
        console.log(`\n> Table: ${table}`);

        try {
            // Get data from local
            const rows = localDb.prepare(`SELECT * FROM ${table}`).all();
            console.log(`   Found ${rows.length} rows locally.`);

            if (rows.length === 0) continue;

            const keys = Object.keys(rows[0]);
            const columns = keys.map(k => `"${k}"`).join(',');
            const placeholders = keys.map(() => '?').join(',');
            const sql = `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`;

            let processed = 0;
            // Split into chunks manually to control concurrency
            for (let i = 0; i < rows.length; i += BATCH_SIZE) {
                const batch = rows.slice(i, i + BATCH_SIZE);

                const promises = batch.map(row => {
                    const args = keys.map(k => {
                        const val = row[k];
                        // Convert Buffer to standard array or similar if needed, 
                        // but mostly simple types here.
                        return val;
                    });
                    return turso.execute({ sql, args });
                });

                await Promise.all(promises);
                processed += batch.length;
                process.stdout.write(`   Uploading... ${Math.round((processed / rows.length) * 100)}% (${processed}/${rows.length})\r`);
            }
            console.log(`   ✅ Synced ${table}               `);

        } catch (error) {
            console.error(`   ❌ Error migrating ${table}:`, error.message);
        }
    }

    console.log('\n🎉 Migration Complete!');
}

migrate();
