const express = require('express');

const router = express.Router();

router.post('/create', (request, response) => {
    response.cookie('visitorName', request.body.name || 'Guest', {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    });
    response.json({ message: 'Cookie created' });
});

router.get('/read', (request, response) => {
    response.json({ visitorName: request.cookies.visitorName || null });
});

router.delete('/delete', (request, response) => {
    response.clearCookie('visitorName');
    response.json({ message: 'Cookie deleted' });
});

module.exports = router;