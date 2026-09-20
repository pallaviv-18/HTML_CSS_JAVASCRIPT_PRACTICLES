const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, '..', 'data', 'experiment-notes.txt');
const notes = 'This file was created by the Node.js fs experiment.\n';

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, notes, 'utf8');

fs.readFile(filePath, 'utf8', (error, content) => {
    if (error) {
        console.error('Could not read the file:', error.message);
        process.exitCode = 1;
        return;
    }
    console.log('File contents:', content.trim());
});