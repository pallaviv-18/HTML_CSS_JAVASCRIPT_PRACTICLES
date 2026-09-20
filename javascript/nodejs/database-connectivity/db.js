const fs = require('node:fs');
const path = require('node:path');
const initSqlJs = require('sql.js');

const databasePath = path.join(__dirname, 'data', 'students.sqlite');
let database;

async function connect() {
    const SQL = await initSqlJs({
        locateFile: (file) => path.join(require.resolve('sql.js'), '..', file)
    });

    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    const savedDatabase = fs.existsSync(databasePath)
        ? fs.readFileSync(databasePath)
        : undefined;

    database = savedDatabase ? new SQL.Database(savedDatabase) : new SQL.Database();
    database.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            course TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
    `);
    save();
}

function save() {
    fs.writeFileSync(databasePath, Buffer.from(database.export()));
}

function getStudents() {
    const result = database.exec('SELECT id, name, course, email FROM students ORDER BY id');
    if (result.length === 0) return [];
    return result[0].values.map(([id, name, course, email]) => ({ id, name, course, email }));
}

function getStudent(id) {
    const statement = database.prepare('SELECT id, name, course, email FROM students WHERE id = $id');
    statement.bind({ $id: id });
    const student = statement.step() ? statement.getAsObject() : null;
    statement.free();
    return student;
}

function addStudent({ name, course, email }) {
    database.run('INSERT INTO students (name, course, email) VALUES ($name, $course, $email)', {
        $name: name,
        $course: course,
        $email: email
    });
    save();
    const id = database.exec('SELECT id FROM students ORDER BY id DESC LIMIT 1')[0].values[0][0];
    return getStudent(id);
}

function updateStudent(id, { name, course, email }) {
    database.run(
        'UPDATE students SET name = $name, course = $course, email = $email WHERE id = $id',
        { $id: id, $name: name, $course: course, $email: email }
    );
    save();
    return getStudent(id);
}

function deleteStudent(id) {
    database.run('DELETE FROM students WHERE id = $id', { $id: id });
    save();
}

module.exports = { connect, getStudents, getStudent, addStudent, updateStudent, deleteStudent };