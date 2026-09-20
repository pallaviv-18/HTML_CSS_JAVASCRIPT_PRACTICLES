const express = require('express');
const { createMessage, getStatus } = require('../controllers/siteController');

const router = express.Router();

router.get('/', (request, response) => {
    response.sendFile('index.html', { root: require('node:path').join(__dirname, '..', 'public') });
});

router.get('/api/status', (request, response) => {
    response.json(getStatus());
});

router.post('/api/messages', (request, response) => {
    const { name, message } = request.body;

    if (!name || !message) {
        response.status(400).json({ error: 'Name and message are required.' });
        return;
    }

    response.status(201).json(createMessage(name, message));
});

module.exports = router;