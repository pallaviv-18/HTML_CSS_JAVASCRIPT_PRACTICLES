const express = require('express');
const database = require('../db/database');
const { requireJwt, requireRole } = require('../middleware/auth');
const { requireFields, validateId } = require('../middleware/validation');

const router = express.Router();
router.use(requireJwt);

router.get('/', (request, response) => {
    const search = request.query.search || '';
    const students = database.prepare(
        'SELECT * FROM students WHERE name LIKE ? OR course LIKE ? ORDER BY id DESC'
    ).all(`%${search}%`, `%${search}%`);
    response.json({ students });
});

router.get('/:id', validateId, (request, response, next) => {
    const student = database.prepare('SELECT * FROM students WHERE id = ?').get(request.params.id);
    if (!student) {
        const error = new Error('Student not found.');
        error.statusCode = 404;
        return next(error);
    }
    response.json({ student });
});

router.post('/', requireRole('admin'), requireFields(['name', 'email', 'course', 'age']), (request, response, next) => {
    try {
        const age = Number(request.body.age);
        if (!Number.isInteger(age) || age < 1 || age > 120) {
            const error = new Error('Age must be an integer between 1 and 120.');
            error.statusCode = 400;
            throw error;
        }
        const result = database.prepare(
            'INSERT INTO students (name, email, course, age) VALUES (?, ?, ?, ?)'
        ).run(request.body.name.trim(), request.body.email.trim(), request.body.course.trim(), age);
        response.status(201).json({ student: database.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid) });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', requireRole('admin'), validateId, requireFields(['name', 'email', 'course', 'age']), (request, response, next) => {
    try {
        const age = Number(request.body.age);
        if (!Number.isInteger(age) || age < 1 || age > 120) {
            const error = new Error('Age must be an integer between 1 and 120.');
            error.statusCode = 400;
            throw error;
        }
        const result = database.prepare(
            'UPDATE students SET name = ?, email = ?, course = ?, age = ? WHERE id = ?'
        ).run(request.body.name.trim(), request.body.email.trim(), request.body.course.trim(), age, request.params.id);
        if (!result.changes) {
            const error = new Error('Student not found.');
            error.statusCode = 404;
            throw error;
        }
        response.json({ student: database.prepare('SELECT * FROM students WHERE id = ?').get(request.params.id) });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', requireRole('admin'), validateId, (request, response, next) => {
    const result = database.prepare('DELETE FROM students WHERE id = ?').run(request.params.id);
    if (!result.changes) {
        const error = new Error('Student not found.');
        error.statusCode = 404;
        return next(error);
    }
    response.status(204).end();
});

module.exports = router;