const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'anime');

if (fs.existsSync(IMAGE_DIR)) {
    const files = fs.readdirSync(IMAGE_DIR);
    let deleted = 0;

    files.forEach(file => {
        const filePath = path.join(IMAGE_DIR, file);
        const stats = fs.statSync(filePath);
        if (stats.size < 1000) { // < 1KB
            fs.unlinkSync(filePath);
            deleted++;
        }
    });

    console.log(`Deleted ${deleted} bad files.`);
}
