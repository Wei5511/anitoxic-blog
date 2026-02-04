// Automated batch update runner
// Runs multiple batches with progress tracking

const totalBatches = 50; // Run 50 batches (50 × 20 = 1000 anime)
const delayBetweenBatches = 2000; // 2 seconds between batches

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBatchUpdates() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       自動批次更新中文標題 - Automated Batch Updater       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Get initial status
    console.log('📊 檢查初始狀態...\n');
    const initialRes = await fetch('http://localhost:3001/api/batch-update-titles');
    const initialStatus = await initialRes.json();

    console.log('初始狀態：');
    console.log(`  總數: ${initialStatus.stats.total}`);
    console.log(`  已有中文: ${initialStatus.stats.with_chinese} (${initialStatus.stats.percentage})`);
    console.log(`  未有中文: ${initialStatus.stats.without_chinese}\n`);

    const startTime = Date.now();
    let totalUpdated = 0;
    let totalFailed = 0;

    console.log(`🚀 開始執行 ${totalBatches} 個批次...\n`);
    console.log('─'.repeat(60) + '\n');

    for (let i = 1; i <= totalBatches; i++) {
        const batchStartTime = Date.now();

        try {
            console.log(`[批次 ${i}/${totalBatches}] 處理中...`);

            const res = await fetch('http://localhost:3001/api/batch-update-titles', {
                method: 'POST'
            });

            const result = await res.json();

            if (result.success) {
                totalUpdated += result.updated;
                totalFailed += result.failed;

                const batchTime = ((Date.now() - batchStartTime) / 1000).toFixed(1);

                console.log(`  ✅ 完成: ${result.updated} 成功, ${result.failed} 失敗 (耗時 ${batchTime}s)`);

                // Show some successful titles
                if (result.results && result.results.length > 0) {
                    const successful = result.results.filter(r => r.status === 'success').slice(0, 3);
                    if (successful.length > 0) {
                        console.log(`  📝 範例:`);
                        successful.forEach(r => {
                            console.log(`     • ${r.chinese_title}`);
                        });
                    }
                }

                // Progress summary every 10 batches
                if (i % 10 === 0) {
                    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
                    const avgPerBatch = (totalUpdated / i).toFixed(1);

                    console.log('\n' + '═'.repeat(60));
                    console.log(`📈 進度報告 [${i}/${totalBatches}]`);
                    console.log(`   累計更新: ${totalUpdated} 筆`);
                    console.log(`   累計失敗: ${totalFailed} 筆`);
                    console.log(`   成功率: ${((totalUpdated / (totalUpdated + totalFailed)) * 100).toFixed(1)}%`);
                    console.log(`   平均每批: ${avgPerBatch} 筆`);
                    console.log(`   已用時間: ${elapsed} 分鐘`);
                    console.log('═'.repeat(60) + '\n');
                }

            } else {
                console.log(`  ❌ 錯誤: ${result.error || result.message}`);
            }

        } catch (error) {
            console.log(`  ❌ 執行失敗: ${error.message}`);
        }

        // Delay between batches (except last one)
        if (i < totalBatches) {
            await sleep(delayBetweenBatches);
        }
    }

    // Final status
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 所有批次執行完畢！\n');

    const finalRes = await fetch('http://localhost:3001/api/batch-update-titles');
    const finalStatus = await finalRes.json();

    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    const improvement = finalStatus.stats.with_chinese - initialStatus.stats.with_chinese;

    console.log('📊 最終統計：');
    console.log(`  初始: ${initialStatus.stats.with_chinese} 筆 (${initialStatus.stats.percentage})`);
    console.log(`  最終: ${finalStatus.stats.with_chinese} 筆 (${finalStatus.stats.percentage})`);
    console.log(`  改善: +${improvement} 筆 ⬆️`);
    console.log(`  成功率: ${((totalUpdated / (totalUpdated + totalFailed)) * 100).toFixed(1)}%`);
    console.log(`  總耗時: ${totalTime} 分鐘`);
    console.log('═'.repeat(60) + '\n');
}

// Run
runBatchUpdates()
    .then(() => {
        console.log('✅ 全部完成！');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ 致命錯誤:', error);
        process.exit(1);
    });
