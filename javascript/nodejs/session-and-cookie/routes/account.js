const express = require('express');
const requireSession = require('../middleware/requireSession');

const router = express.Router();

router.get('/', (request, response) => {
    response.json({
        loggedIn: Boolean(request.session.user),
        user: request.session.user || null
    });
});

router.post('/login', (request, response) => {
    const username = request.body.username;

    if (!username) {
        response.status(400).json({ error: 'username is required' });
        return;
    }

    request.session.user = { username };
    response.json({ message: 'Login successful', user: request.session.user });
});

router.post('/logout', (request, response) => {
    request.session.destroy((error) => {
        if (error) {
            response.status(500).json({ error: 'Could not log out' });
            return;
        }

        response.clearCookie('connect.sid');
        response.json({ message: 'Logout successful' });
    });
});

router.get('/protected', requireSession, (request, response) => {
    response.json({
        message: 'Protected session content',
        user: request.session.user
    });
});

module.exports = router;