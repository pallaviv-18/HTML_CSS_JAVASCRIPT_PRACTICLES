# Express.js Student Management

This is a modular Express application covering the requested Express, routing, middleware, session, cookie, database, CRUD, authentication, authorization, and REST API examples.

## Run

```bash
cd javascript/express/student-management
npm install
npm start
```

Open `http://localhost:3001`. The SQLite database is created at `db/app.db` on first start.

Demo administrator: `admin@example.com` / `Admin@123`.

## Structure

- `server.js`: Express setup, static files, cookie routes, session configuration, and middleware order.
- `routes/auth.js`: registration, bcrypt password hashing, session login/logout, and JWT creation.
- `routes/students.js`: authenticated student CRUD with query search and admin authorization.
- `routes/products.js`: authenticated product CRUD using GET, POST, PATCH, and DELETE.
- `routes/users.js`: admin-only user listing.
- `db/database.js`: SQLite tables, seed administrator, and database connection.
- `middleware/logging.js`: request logging and response timing.
- `middleware/validation.js`: body and route-parameter validation.
- `middleware/auth.js`: session authentication, JWT authentication, and role authorization.
- `middleware/errors.js`: 404 and centralized API error handling.
- `public/`: static HTML, CSS, and browser JavaScript client.

## REST API examples

Register with `POST /api/auth/register`, then login with `POST /api/auth/login` to receive a JWT. Send it as `Authorization: Bearer <token>` to `/api/students`, `/api/products`, and `/api/users`.

All student and product records support database-backed create, read, update, and delete operations. Admins can modify records; authenticated users can read them. Use Postman, curl, or the included HTML client to test the APIs and HTTP status codes.