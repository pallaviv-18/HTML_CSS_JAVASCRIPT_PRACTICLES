const fs = require('fs');
const path = require('path');
const initializeSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');

const databasePath = path.join(__dirname, 'app.db');
let database;

async function initialize() {
    const SQL = await initializeSqlJs({ locateFile: (file) => require.resolve(`sql.js/dist/${file}`) });
    const savedDatabase = fs.existsSync(databasePath) ? fs.readFileSync(databasePath) : null;
    database = savedDatabase ? new SQL.Database(savedDatabase) : new SQL.Database();
    database.run('PRAGMA foreign_keys = ON');
    database.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        course TEXT NOT NULL,
        age INTEGER NOT NULL CHECK (age BETWEEN 1 AND 120),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL CHECK (price >= 0),
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    `);

    const admin = prepare('SELECT id FROM users WHERE email = ?').get('admin@example.com');
    if (!admin) {
        prepare(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
        ).run('Administrator', 'admin@example.com', bcrypt.hashSync('Admin@123', 10), 'admin');
    }
    persist();
}

function prepare(sql) {
    return {
        get(...params) {
            const statement = database.prepare(sql);
            statement.bind(params);
            const result = statement.step() ? statement.getAsObject() : undefined;
            statement.free();
            return result;
        },
        all(...params) {
            const statement = database.prepare(sql);
            statement.bind(params);
            const rows = [];
            while (statement.step()) rows.push(statement.getAsObject());
            statement.free();
            return rows;
        },
        run(...params) {
            const statement = database.prepare(sql);
            statement.run(params);
            const changes = database.getRowsModified();
            statement.free();
            const result = database.exec('SELECT last_insert_rowid() AS id');
            persist();
            return { changes, lastInsertRowid: result[0].values[0][0] };
        }
    };
}

function persist() {
    fs.writeFileSync(databasePath, Buffer.from(database.export()));
}

module.exports = { initialize, prepare, persist };