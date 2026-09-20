const http = require('http');
const { URL } = require('url');
const { add } = require('./lib/math');
const { ensureNotesFile, readNotesWithPromise, getFileDetails } = require('./file-demo');
const { logRequest, logError } = require('./lib/logger');

const port = Number(process.env.PORT) || 3000;

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(payload, null, 2));
}

async function handleRequest(request, response) {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const route = requestUrl.pathname;

    if (request.method === 'GET' && route === '/') {
        sendJson(response, 200, {
            message: 'Node.js client-server architecture demo',
            routes: ['/', '/about', '/api/add?a=2&b=3', '/api/file']
        });
        return;
    }

    if (request.method === 'GET' && route === '/about') {
        sendJson(response, 200, {
            lesson: 'Request-response cycle',
            request: { method: request.method, url: request.url },
            response: 'The server received the request and returned this JSON response.'
        });
        return;
    }

    if (request.method === 'GET' && route === '/api/add') {
        const firstNumber = Number(requestUrl.searchParams.get('a'));
        const secondNumber = Number(requestUrl.searchParams.get('b'));
        if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
            sendJson(response, 400, { error: 'Query parameters a and b must be numbers.' });
            return;
        }
        sendJson(response, 200, { a: firstNumber, b: secondNumber, result: add(firstNumber, secondNumber) });
        return;
    }

    if (request.method === 'GET' && route === '/api/file') {
        const contents = await readNotesWithPromise();
        sendJson(response, 200, { file: getFileDetails(), contents: contents.trim() });
        return;
    }

    sendJson(response, 404, { error: 'Route not found.' });
}

const server = http.createServer((request, response) => {
    handleRequest(request, response)
        .then(() => logRequest(request.method, request.url, response.statusCode))
        .catch((error) => {
            logError(error);
            sendJson(response, 500, { error: 'Internal server error.' });
        });
});

ensureNotesFile();
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Try /, /about, /api/add?a=2&b=3, and /api/file');
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('\nServer stopped.');
        process.exit(0);
    });
});