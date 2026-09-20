const http = require('node:http');

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Server received the client request.');
});

server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    console.log(`Server listening on port ${port}`);

    http.get(`http://127.0.0.1:${port}`, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => {
            console.log('Client received:', body);
            server.close();
        });
    }).on('error', (error) => {
        console.error('Client error:', error.message);
        server.close(() => process.exitCode = 1);
    });
});