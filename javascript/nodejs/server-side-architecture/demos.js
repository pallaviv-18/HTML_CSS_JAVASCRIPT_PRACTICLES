const { add, multiply } = require('./lib/math');
const {
    ensureNotesFile,
    readNotesWithCallback,
    readNotesWithPromise,
    getFileDetails
} = require('./file-demo');
const { logError } = require('./lib/logger');

function callbackExample() {
    return new Promise((resolve, reject) => {
        readNotesWithCallback((error, contents) => {
            if (error) {
                reject(error);
                return;
            }
            console.log('Callback result:', contents.trim());
            resolve();
        });
    });
}

function promiseExample() {
    return readNotesWithPromise().then((contents) => {
        console.log('Promise result:', contents.trim());
    });
}

async function asyncAwaitExample() {
    const contents = await readNotesWithPromise();
    console.log('Async/await result:', contents.trim());
}

async function runDemos() {
    try {
        ensureNotesFile();
        console.log('Custom module:', add(2, 3), multiply(4, 5));
        console.log('Path module:', getFileDetails());
        await callbackExample();
        await promiseExample();
        await asyncAwaitExample();
    } catch (error) {
        logError(error);
        process.exitCode = 1;
    }
}

runDemos();