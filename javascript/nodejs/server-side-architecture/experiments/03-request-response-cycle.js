const http = require('node:http');

const port = Number(process.env.PORT) || 3003;

const server = http.createServer((request, response) => {
    const responseData = {
        method: request.method,
        url: request.url,
        message: 'The request was received and a response was returned.'
    };

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(responseData, null, 2));
});

server.listen(port, () => {
    console.log(`Request-response demo: http://localhost:${port}`);
});