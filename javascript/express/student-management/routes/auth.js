const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../db/database');
const { jwtSecret, requireSession } = require('../middleware/auth');
const { requireFields } = require('../middleware/validation');

const router = express.Router();

function publicUser(user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
}

router.post('/register', requireFields(['name', 'email', 'password']), (request, response, next) => {
    try {
        const { name, email, password } = request.body;
        if (password.length < 6) {
            const error = new Error('Password must contain at least 6 characters.');
            error.statusCode = 400;
            throw error;
        }
        const result = database.prepare(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
        ).run(name.trim(), email.trim().toLowerCase(), bcrypt.hashSync(password, 10));
        const user = database.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
        response.status(201).json({ user: publicUser(user) });
    } catch (error) {
        next(error);
    }
});

router.post('/login', requireFields(['email', 'password']), (request, response, next) => {
    try {
        const user = database.prepare('SELECT * FROM users WHERE email = ?').get(request.body.email.toLowerCase());
        if (!user || !bcrypt.compareSync(request.body.password, user.password_hash)) {
            const error = new Error('Invalid email or password.');
            error.statusCode = 401;
            throw error;
        }

        request.session.user = publicUser(user);
        const token = jwt.sign(publicUser(user), jwtSecret, { expiresIn: '1h' });
        response.json({ message: 'Login successful.', user: publicUser(user), token });
    } catch (error) {
        next(error);
    }
});

router.post('/logout', (request, response) => {
    request.session.destroy(() => {
        response.clearCookie('connect.sid');
        response.json({ message: 'Logout successful.' });
    });
});

router.get('/me', requireSession, (request, response) => {
    response.json({ user: request.currentUser });
});

module.exports = router;