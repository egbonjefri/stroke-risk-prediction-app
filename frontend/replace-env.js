const fs = require('fs');
const filePath = './resources/script/script.js';

let content = fs.readFileSync(filePath, { encoding: 'utf8' });
content = content.replace('%%API_ENDPOINT%%', process.env.API_ENDPOINT);

fs.writeFileSync(filePath, content, { encoding: 'utf8' });