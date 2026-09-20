const path = require('node:path');

const filePath = path.join(__dirname, '..', 'data', 'notes.txt');

console.log('Full path:', filePath);
console.log('Directory:', path.dirname(filePath));
console.log('File name:', path.basename(filePath));
console.log('Extension:', path.extname(filePath));