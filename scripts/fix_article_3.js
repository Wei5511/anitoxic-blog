const Database = require('better-sqlite3');
const db = new Database('anime.db');

const targetId = 3;
const title = '【我推的孩子】第三季';
// Verified Cloudfront URL from myvideo_library (Step 3780)
const imgUrl = 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5505/slfBxrWWvq.jpg';
const linkUrl = 'https://www.myvideo.net.tw/details/3/23277'; // Using ID 23277 from library entry if available, or just standard link. Assuming 23277 based on context or we can find it. 
// Actually, let's look up the ID from library first to be 100% sure.
const libEntry = db.prepare('SELECT url FROM myvideo_library WHERE title = ?').get(title);
const realLink = libEntry ? libEntry.url : 'https://www.myvideo.net.tw/details/3/23277'; // Fallback if mismatched

const getBtn = (url) => `\n\n<a href="${url}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>\n\n`;

// Content structure mimicking Article 875
// ## 1. [Title]
// ![[Title]]([URL])
// [Description]
// [Button]
// ---

const desc = `演藝圈的明爭暗鬥升級！B小町爆紅在即，阿奎亞與露比在復仇與成名的道路上越走越遠，真相即將揭曉。

本季進入了原作中情感濃度最高、也是角色衝突最激烈的篇章「電影篇」。製作組透過細膩的作畫與分鏡，將角色們內心的掙扎與渴望表現得淋漓盡致。從舞台劇的排練到正式演出，每一個眼神、每一個動作都充滿了戲劇張力。

隨著劇情的推進，星野愛的過去也將一步步被揭開，阿奎亞與露比將如何面對這殘酷的真相？這不僅是一部講述演藝圈生態的作品，更是一部探討人性、謊言與愛的深刻之作。`;

let newContent = ``;
newContent += `## 1. ${title}\n`;
newContent += `![${title}](${imgUrl})\n\n`;
newContent += `${desc}\n`;
newContent += getBtn(realLink);
newContent += `\n---\n\n`;
newContent += `## 觀看資訊\n`;
newContent += `本作品目前已在 MyVideo 上架。作為台灣主要的影音串流平台之一，MyVideo 提供高畫質的正版動畫內容。\n\n`;
newContent += `若您對這部作品感興趣，建議直接點擊上方連結前往觀看。支持正版播出不僅能獲得最佳的觀影品質，也是給予製作團隊最大的鼓勵。\n\n`;

const stmt = db.prepare('UPDATE articles SET content = ?, image_url = ?, title = ? WHERE id = ?');
const res = stmt.run(newContent, imgUrl, title, targetId);

console.log(`Updated Article ${targetId}. Changes: ${res.changes}`);
console.log(`Image set to: ${imgUrl}`);
