# Node.js Server-Side Architecture

This project demonstrates a basic client-server application using only Node.js built-in modules, plus the `chalk` npm package for colored logs.

## Run it

The separate backend experiments are in [`experiments/`](experiments/README.md).
They cover client-server architecture, HTTP servers, request-response handling,
Node.js fundamentals, built-in modules, `fs`, `path`, custom modules, npm,
asynchronous patterns, and error handling.

Open a terminal in this folder and install the package:

```bash
npm install
```

Start the HTTP server:

```bash
npm start
```

Open these URLs in a browser, or request them with a client such as `curl`:

- `http://localhost:3000/` - server information and available routes
- `http://localhost:3000/about` - request-response cycle details
- `http://localhost:3000/api/add?a=2&b=3` - custom module and query parameters
- `http://localhost:3000/api/file` - asynchronous file-system response

Run the language and module demonstrations in a second terminal:

```bash
npm run demo
```

## What each file demonstrates

- `server.js`: `http.createServer`, routing, JSON responses, status codes, request handling, and error handling.
- `file-demo.js`: the `fs` and `path` built-in modules, synchronous setup, callback file reading, and promise-based file reading.
- `lib/math.js`: a custom Node.js module exported and imported with `require`.
- `lib/logger.js`: another custom module that uses the installed `chalk` npm package.
- `demos.js`: callbacks, promises, async/await, and `try/catch` error handling.

The server creates `data/notes.txt` automatically the first time it runs.