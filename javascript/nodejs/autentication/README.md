# Authentication

This project demonstrates registration, bcrypt password hashing and
verification, JWT login/logout, and a protected profile API.

```bash
npm install
npm start
```

Register with `POST /register`, login with `POST /login`, then send the
returned token as `Authorization: Bearer <token>` to `/api/profile` or
`POST /logout`.