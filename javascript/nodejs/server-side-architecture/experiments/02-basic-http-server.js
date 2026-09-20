const http = require('node:http');

const port = Number(process.env.PORT) || 3002;

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end('<h1>Basic Node.js HTTP Server</h1><p>The server is running.</p>');
});

server.listen(port, () => {
    console.log(`Open http://localhost:${port}`);
});