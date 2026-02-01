const fs = require('fs');
const path = require('path');

const ids = [
    '17384', '17393', '32386', '2361', '12695', '31206', '20786', '31153', '19321', '27046',
    '24227', '13562', '17235', '23246', '26203', '21049', '14640', '20885', '21011', '23245',
    '18962', '4819', '6511', '2578', '17236', '12704', '12703', '31281', '22427', '23334',
    '24584', '4665', '17849', '24292', '32428', '31432', '14624', '21157', '16763', '27855',
    '21772', '32347', '31733', '27905', '5364', '14619', '5310', '21246', '24692', '13241'
];

const scriptFiles = [
    'user_urls_1.txt', 'user_urls_2.txt', 'user_urls_3.txt', 'user_urls_4.txt', 'all_matches.txt'
];

const results = {};

scriptFiles.forEach(file => {
    const filePath = path.join(__dirname, 'scripts', file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach(line => {
        ids.forEach(id => {
            if (line.includes(`/${id}`)) {
                const parts = line.split('\t');
                const title = parts[0].trim();
                if (!results[id]) results[id] = new Set();
                results[id].add(title);
            }
        });
    });
});

Object.keys(results).forEach(id => {
    results[id] = Array.from(results[id]);
});

console.log(JSON.stringify(results, null, 2));
