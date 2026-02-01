const fs = require('fs');
const path = require('path');

const outFile = path.join(__dirname, 'myvideo_links_raw.txt');

const additionalLinks = `
葬送的芙莉蓮	https://www.myvideo.net.tw/details/4/32568
咒術迴戰	https://www.myvideo.net.tw/details/4/24125
我推的孩子	https://www.myvideo.net.tw/details/3/23277
MF Ghost 燃油車鬥魂	https://www.myvideo.net.tw/details/4/28879
判處勇者刑	https://www.myvideo.net.tw/details/3/32447
相反的你和我	https://www.myvideo.net.tw/details/3/32423
JOJO的奇妙冒險 飆馬野郎	https://www.myvideo.net.tw/details/4/21347
`;

// Append ensuring UTF-8
try {
    fs.appendFileSync(outFile, additionalLinks, 'utf-8');
    console.log('✅ Appended user links (UTF-8).');
} catch (err) {
    console.error('Error appending links:', err);
}
