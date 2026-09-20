# Database Connectivity Practicals

This project connects Node.js to a file-backed SQLite database using `sql.js`.
It demonstrates:

1. Connecting to a database.
2. Creating a `students` table.
3. Inserting records with `POST /students`.
4. Retrieving records with `GET /students` and `GET /students/:id`.
5. Updating records with `PUT /students/:id`.
6. Deleting records with `DELETE /students/:id`.

## Run it

```bash
npm install
npm start
```

The app runs at `http://localhost:3008` and stores its database in
`data/students.sqlite`.

Example request body:

```json
{
  "name": "Pallavi",
  "course": "Node.js",
  "email": "pallavi@example.com"
}
```