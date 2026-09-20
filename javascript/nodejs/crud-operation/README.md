# CRUD Operation

Database-backed Student, User, and Product management using Express and
SQLite (`sql.js`). All resources support GET, POST, PUT, and DELETE.

```bash
npm install
npm start
```

Examples: `GET /students`, `POST /users`, `PUT /products/1`, and
`DELETE /students/1`. JSON validation returns `400`, missing records return
`404`, successful creation returns `201`, and deletion returns `204`.