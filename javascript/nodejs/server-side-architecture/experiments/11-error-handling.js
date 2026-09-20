const fs = require('node:fs');

try {
    JSON.parse('{ invalid json }');
} catch (error) {
    console.log('Synchronous error handled:', error.name);
}

fs.readFile('missing-file.txt', 'utf8', (error) => {
    if (error) {
        console.log('Asynchronous error handled:', error.code);
        return;
    }
    console.log('File read successfully.');
});