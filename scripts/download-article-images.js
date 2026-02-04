const fs = require('fs');
const axios = require('axios');
const path = require('path');

const images = [
    { url: "https://upload.wikimedia.org/wikipedia/en/3/36/Y%C5%ABsha_Party_o_Oidasareta_Kiy%C5%8Dbinb%C5%8D_light_novel_volume_1_cover.jpg", funcName: "party-outcast.jpg" },
    { url: "https://upload.wikimedia.org/wikipedia/en/4/46/Jujutsu_kaisen_level_1.jpg", funcName: "jjk-s3.jpg" }, // JJK placeholder
    { url: "https://upload.wikimedia.org/wikipedia/en/5/53/Frieren_After_the_End_Vol_1_Cover.jpg", funcName: "frieren-s2.jpg" }, // Frieren placeholder
    { url: "https://upload.wikimedia.org/wikipedia/en/9/91/Oshi_no_Ko_volume_1_cover.png", funcName: "oshi-no-ko-s3.jpg" }, // Oshi no Ko placeholder
    { url: "https://upload.wikimedia.org/wikipedia/en/f/f9/Tensei_Kizoku%2C_Kantei_Skill_de_Nariagaru_light_novel_volume_1_cover.jpg", funcName: "noble-reincarnation.jpg" } // Aristocrat Reborn placeholder (actually Reincarnated as an Aristocrat with Appraisal Skill, user said 'Aristocrat Reborn' but description matches 'Noble Reincarnation'/'Level Infinity' one? Wait, user description: "Noble Reincarnation ~Born Blessed, So I'll Obtain Ultimate Power~" - that's 'Kizoku Tensei'. Let me search exact title first.)
];

// Re-search for Noble Reincarnation if needed. The user said "Noble Reincarnation ~Born Blessed..." ("Level Infinity").
// "Tensei Kizoku, Kantei Skill" is DIFFERENT.
// Correct title: "Kizoku Tensei: Megumareta Umare kara Saikyou no Chikara wo Eru"
// Let's use a generic fantasy image if we can't find exact Wiki.
// Or just try to find the specific one.

async function download(url, filename) {
    if (!url) return;
    const dest = path.join(__dirname, '..', 'public', 'images', 'anime', filename);
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
            writer.on('finish', () => { console.log(`Downloaded ${filename}`); resolve(); });
            writer.on('error', reject);
        });
    } catch (e) {
        console.error(`Failed ${filename}:`, e.message);
    }
}

// Update list with better URLs if found
const images_final = [
    { url: "https://upload.wikimedia.org/wikipedia/en/3/36/Y%C5%ABsha_Party_o_Oidasareta_Kiy%C5%8Dbinb%C5%8D_light_novel_volume_1_cover.jpg", name: "party-outcast.jpg" },
    { url: "https://cdn.myanimelist.net/images/anime/1121/119532.jpg", name: "jjk-s3.jpg" }, // Shibuya/Culling generic
    { url: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg", name: "frieren-s2.jpg" },
    { url: "https://cdn.myanimelist.net/images/anime/1812/134736.jpg", name: "oshi-no-ko-s3.jpg" },
    { url: "https://cdn.myanimelist.net/images/anime/1665/136734.jpg", name: "noble-reincarnation.jpg" } // Trying generic isekai noble URL
];

(async () => {
    for (const img of images_final) {
        await download(img.url, img.name);
    }
})();
