# Authorization and RESTful APIs

This project covers role-based authorization, admin/user roles, authorization
middleware, JWT authentication, validation, status codes, error handling, and
database-backed Student, Product, and User REST APIs.

```bash
npm install
npm start
```

Use `POST /register` and `POST /login`, then send the JWT as
`Authorization: Bearer <token>`. Admins can list users and delete records;
authenticated users can read and create students/products and update records.

The endpoints can be tested in Postman using JSON requests. Examples:
`GET /students`, `POST /students`, `PUT /students/1`, and `DELETE /students/1`.