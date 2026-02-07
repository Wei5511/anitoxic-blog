// Native fetch in Node 18+

const API_URL = 'http://localhost:3000/api/batch-update-titles';
const DELAY_MS = 1000; // Delay between batches

async function run() {
    console.log(`Starting batch updates via ${API_URL}...`);
    let totalUpdated = 0;
    let batchCount = 0;

    while (true) {
        batchCount++;
        try {
            const res = await fetch(API_URL);
            if (!res.ok) {
                console.error(`Batch ${batchCount} failed: ${res.status} ${res.statusText}`);
                break;
            }

            const data = await res.json();

            console.log(`Batch ${batchCount}: Processed ${data.processed}, Updated ${data.updated}`);
            totalUpdated += data.updated;

            // Stop if no items were processed (means no more missing titles or DB query limit reached)
            if (data.processed === 0) {
                console.log('No more items to process. Finished.');
                break;
            }

            // Optional: Message check
            if (data.message === "No missing titles found") {
                break;
            }

            // Wait before next batch
            await new Promise(r => setTimeout(r, DELAY_MS));

        } catch (err) {
            console.error(`Error in batch ${batchCount}:`, err.message);
            // Wait longer on error before retry
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    console.log(`=== Complete ===`);
    console.log(`Total Batches: ${batchCount}`);
    console.log(`Total Updated: ${totalUpdated}`);
}

run();
