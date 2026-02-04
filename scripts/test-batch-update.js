// Test script to run batch update
// Usage: node test-batch-update.js

async function testBatchUpdate() {
    console.log('=== Testing Batch Update API ===\n');

    try {
        // First, check status
        console.log('1. Checking current status...');
        const statusRes = await fetch('http://localhost:3001/api/batch-update-titles');
        const status = await statusRes.json();

        console.log('Current status:');
        console.log(`  Total anime: ${status.stats.total}`);
        console.log(`  With Chinese: ${status.stats.with_chinese} (${status.stats.percentage})`);
        console.log(`  Without Chinese: ${status.stats.without_chinese}\n`);

        // Ask user confirmation
        console.log('2. Starting batch update (20 anime)...\n');

        const updateRes = await fetch('http://localhost:3001/api/batch-update-titles', {
            method: 'POST'
        });

        const result = await updateRes.json();

        console.log('\n=== Update Complete ===');
        console.log(`Success: ${result.success}`);
        console.log(`Message: ${result.message}`);
        console.log(`Updated: ${result.updated}`);
        console.log(`Failed: ${result.failed}\n`);

        if (result.results && result.results.length > 0) {
            console.log('Results:');
            result.results.forEach((r, i) => {
                const status = r.status === 'success' ? '✅' : r.status === 'not_found' ? '⚠️' : '❌';
                console.log(`  ${status} [${i + 1}] ${r.title}`);
                if (r.chinese_title) {
                    console.log(`      中文: ${r.chinese_title}`);
                }
            });
        }

        // Check status again
        console.log('\n3. Checking updated status...');
        const newStatusRes = await fetch('http://localhost:3001/api/batch-update-titles');
        const newStatus = await newStatusRes.json();

        console.log('New status:');
        console.log(`  With Chinese: ${newStatus.stats.with_chinese} (${newStatus.stats.percentage})`);
        console.log(`  Without Chinese: ${newStatus.stats.without_chinese}`);
        console.log(`\n  Improvement: +${newStatus.stats.with_chinese - status.stats.with_chinese} titles\n`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testBatchUpdate();
