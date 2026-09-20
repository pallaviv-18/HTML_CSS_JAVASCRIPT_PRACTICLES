const wait = (value, callback) => {
    setTimeout(() => callback(null, value), 50);
};

wait('Callback completed', (error, result) => {
    if (error) {
        console.error(error.message);
        return;
    }
    console.log(result);
});

const waitWithPromise = (value) => new Promise((resolve) => {
    setTimeout(() => resolve(value), 50);
});

waitWithPromise('Promise completed')
    .then((result) => console.log(result))
    .catch((error) => console.error(error.message));

async function runAsyncExample() {
    const result = await waitWithPromise('Async/await completed');
    console.log(result);
}

runAsyncExample().catch((error) => console.error(error.message));