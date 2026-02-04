const fs = require('fs');
const axios = require('axios');
const path = require('path');

const url = "https://upload.wikimedia.org/wikipedia/en/3/36/Y%C5%ABsha_Party_o_Oidasareta_Kiy%C5%8Dbinb%C5%8D_light_novel_volume_1_cover.jpg";
const dest = path.join(__dirname, '..', 'public', 'images', 'anime', 'party-outcast.jpg');

async function download() {
    try {
        const writer = fs.createWriteStream(dest);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (e) {
        console.error('Download failed:', e.message);
    }
}

download().then(() => console.log('Image downloaded to', dest));
