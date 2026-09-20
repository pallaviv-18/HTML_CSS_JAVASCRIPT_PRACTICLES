# Express Framework Practicals

This is a separate Express.js application under the Node.js folder. It
demonstrates:

1. A basic Express application.
2. GET and POST request handling.
3. Static files served from `public/`.
4. HTML and JSON responses.
5. A modular structure using `routes/` and `controllers/`.

## Run it

From this folder, install dependencies and start the server:

```bash
npm install
npm start
```

Open `http://localhost:3004` in a browser. The JSON endpoint is available at
`http://localhost:3004/api/status`.

The POST endpoint is `POST /api/messages` and accepts `name` and `message`.