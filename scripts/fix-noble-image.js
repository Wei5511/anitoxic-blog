const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Noble Reincarnation Cover (Wiki or MAL)
const url = 'https://upload.wikimedia.org/wikipedia/en/f/f9/Tensei_Kizoku%2C_Kantei_Skill_de_Nariagaru_light_novel_volume_1_cover.jpg';
const dest = path.join(__dirname, '..', 'public', 'images', 'anime', 'noble-reincarnation.jpg');

async function download() {
    try {
        console.log('Downloading Noble Reincarnation cover...');
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.google.com/'
            }
        });
        response.data.pipe(fs.createWriteStream(dest));
        await new Promise(resolve => response.data.on('end', resolve));
        console.log('Download success.');
    } catch (e) {
        console.error('Download failed:', e.message);
        // Fallback: copy generic or try another
    }
}

download();
