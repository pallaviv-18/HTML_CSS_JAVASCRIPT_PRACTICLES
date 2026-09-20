const fs = require('node:fs');
const path = require('node:path');
const initSqlJs = require('sql.js');

let database;
const databaseFile = path.join(__dirname, 'data', 'api.sqlite');

async function getDatabase() {
    if (database) return database;
    const SQL = await initSqlJs({ locateFile: (file) => path.join(__dirname, 'node_modules/sql.js/dist', file) });
    database = fs.existsSync(databaseFile) ? new SQL.Database(fs.readFileSync(databaseFile)) : new SQL.Database();
    database.run('CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE)');
    database.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL)');
    database.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT "user")');
    saveDatabase();
    return database;
}

function saveDatabase() {
    if (!database) return;
    fs.mkdirSync(path.dirname(databaseFile), { recursive: true });
    fs.writeFileSync(databaseFile, Buffer.from(database.export()));
}

module.exports = { getDatabase, saveDatabase };