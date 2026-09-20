const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    response.json({ resource: 'users', users: ['Asha', 'Pallavi', 'Ravi'] });
});

router.get('/:userId', (request, response) => {
    response.json({
        resource: 'users',
        userId: request.params.userId,
        message: 'The user ID came from a route parameter.'
    });
});

module.exports = router;