const fs = require('node:fs');
const path = require('node:path');
const initSqlJs = require('sql.js');

const databaseFile = path.join(__dirname, 'data', 'crud.sqlite');
let database;

async function getDatabase() {
    if (database) return database;
    const SQL = await initSqlJs({ locateFile: (file) => path.join(__dirname, 'node_modules/sql.js/dist', file) });
    database = fs.existsSync(databaseFile) ? new SQL.Database(fs.readFileSync(databaseFile)) : new SQL.Database();
    database.run('CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, course TEXT NOT NULL)');
    database.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE)');
    database.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL)');
    saveDatabase();
    return database;
}

function saveDatabase() {
    if (!database) return;
    fs.mkdirSync(path.dirname(databaseFile), { recursive: true });
    fs.writeFileSync(databaseFile, Buffer.from(database.export()));
}

module.exports = { getDatabase, saveDatabase };