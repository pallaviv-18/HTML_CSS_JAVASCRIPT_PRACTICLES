# Express Routing Practicals

This standalone project is in the Node.js `routing` subfolder. It demonstrates:

1. Basic Express routing with `/` and `/about`.
2. Route parameters such as `/users/42`.
3. Query parameters such as `/products?category=books&limit=5`.
4. Multiple modular routers using `express.Router()`.
5. A JSON 404 / Not Found handler.
6. Modular routes for users, products, and students.

## Run it

```bash
npm install
npm start
```

Open `http://localhost:3005` in a browser. Example routes:

- `GET /about`
- `GET /users`
- `GET /users/42`
- `GET /products?category=books&limit=5`
- `GET /products/101`
- `GET /students/7`
- `GET /route-that-does-not-exist` to see the 404 response