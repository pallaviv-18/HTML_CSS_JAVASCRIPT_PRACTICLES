# Node.js Backend Experiments

Each experiment is a separate runnable file. Run these commands from the
`server-side-architecture` folder.

| No. | File | Demonstrates |
| --- | --- | --- |
| 1 | `01-client-server-architecture.js` | A client request and server response |
| 2 | `02-basic-http-server.js` | A basic Node.js HTTP server |
| 3 | `03-request-response-cycle.js` | Request details and response handling |
| 4 | `04-nodejs-fundamentals.js` | Variables, functions, objects, and process data |
| 5 | `05-built-in-modules.js` | Node.js built-in modules |
| 6 | `06-file-system.js` | The `fs` module |
| 7 | `07-path-module.js` | The `path` module |
| 8 | `08-custom-modules.js` | Importing a custom module |
| 9 | `09-npm-package.js` | Using the installed `chalk` npm package |
| 10 | `10-async-patterns.js` | Callbacks, Promises, and async/await |
| 11 | `11-error-handling.js` | Synchronous and asynchronous error handling |

Run an experiment with:

```bash
node experiments/01-client-server-architecture.js
```

The HTTP server examples in files 2 and 3 keep running until you press
`Ctrl+C`. Use `PORT=3002` or another available port on Windows PowerShell if
port 3000 is already in use:

```powershell
$env:PORT=3002; node experiments/02-basic-http-server.js
```