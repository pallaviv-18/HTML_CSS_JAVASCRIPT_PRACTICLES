const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    response.json({ resource: 'students', students: ['Anita', 'Kiran', 'Meera'] });
});

router.get('/:studentId', (request, response) => {
    response.json({
        resource: 'students',
        studentId: request.params.studentId
    });
});

module.exports = router;