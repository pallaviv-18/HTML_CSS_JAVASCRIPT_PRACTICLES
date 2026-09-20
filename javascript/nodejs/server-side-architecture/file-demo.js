const fs = require('fs');
const path = require('path');

const dataDirectory = path.join(__dirname, 'data');
const notesPath = path.join(dataDirectory, 'notes.txt');

function ensureNotesFile() {
    fs.mkdirSync(dataDirectory, { recursive: true });
    if (!fs.existsSync(notesPath)) {
        fs.writeFileSync(notesPath, 'Node.js uses the fs module to work with files.\n');
    }
}

function readNotesWithCallback(callback) {
    fs.readFile(notesPath, 'utf8', callback);
}

function readNotesWithPromise() {
    return fs.promises.readFile(notesPath, 'utf8');
}

function getFileDetails() {
    return {
        directory: dataDirectory,
        file: notesPath,
        extension: path.extname(notesPath),
        fileName: path.basename(notesPath)
    };
}

module.exports = {
    ensureNotesFile,
    readNotesWithCallback,
    readNotesWithPromise,
    getFileDetails
};