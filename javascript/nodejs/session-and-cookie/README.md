# Session and Cookie Management Practicals

This project demonstrates:

1. Creating, reading, and deleting cookies with `cookie-parser`.
2. Managing sessions with `express-session`.
3. Login and logout using a session.
4. A protected route using session authentication.

## Run it

```bash
npm install
npm start
```

The app runs at `http://localhost:3007`.

Use JSON requests such as:

```json
POST /account/login
{"username":"Pallavi"}
```

The login response sets a session cookie. Send that cookie to
`GET /account/protected`, then use `POST /account/logout` to destroy the
session.