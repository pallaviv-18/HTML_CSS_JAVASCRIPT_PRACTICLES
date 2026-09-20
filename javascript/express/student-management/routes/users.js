const express = require('express');
const bcrypt = require('bcryptjs');
const database = require('../db/database');
const { requireJwt, requireRole } = require('../middleware/auth');
const { requireFields, validateId } = require('../middleware/validation');

const router = express.Router();

router.get('/', requireJwt, requireRole('admin'), (request, response) => {
    const users = database.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC').all();
    response.json({ users });
});

router.get('/:id', requireJwt, requireRole('admin'), validateId, (request, response, next) => {
    const user = database.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(request.params.id);
    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        return next(error);
    }
    response.json({ user });
});

router.post('/', requireJwt, requireRole('admin'), requireFields(['name', 'email', 'password']), (request, response, next) => {
    try {
        const result = database.prepare(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
        ).run(request.body.name.trim(), request.body.email.trim().toLowerCase(), bcrypt.hashSync(request.body.password, 10), request.body.role === 'admin' ? 'admin' : 'user');
        const user = database.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
        response.status(201).json({ user });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', requireJwt, requireRole('admin'), validateId, (request, response, next) => {
    const currentUser = database.prepare('SELECT * FROM users WHERE id = ?').get(request.params.id);
    if (!currentUser) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        return next(error);
    }
    const name = request.body.name === undefined ? currentUser.name : String(request.body.name).trim();
    const role = request.body.role === 'admin' ? 'admin' : request.body.role === 'user' ? 'user' : currentUser.role;
    if (!name) {
        const error = new Error('Name cannot be empty.');
        error.statusCode = 400;
        return next(error);
    }
    database.prepare('UPDATE users SET name = ?, role = ? WHERE id = ?').run(name, role, request.params.id);
    response.json({ user: database.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(request.params.id) });
});

router.delete('/:id', requireJwt, requireRole('admin'), validateId, (request, response, next) => {
    if (Number(request.params.id) === request.currentUser.id) {
        const error = new Error('You cannot delete your own administrator account.');
        error.statusCode = 400;
        return next(error);
    }
    const result = database.prepare('DELETE FROM users WHERE id = ?').run(request.params.id);
    if (!result.changes) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        return next(error);
    }
    response.status(204).end();
});

module.exports = router;