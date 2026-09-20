const express = require('express');
const database = require('../db');

const router = express.Router();

router.get('/', (request, response) => {
    response.json(database.getStudents());
});

router.get('/:id', (request, response) => {
    const student = database.getStudent(Number(request.params.id));
    if (!student) {
        response.status(404).json({ error: 'Student not found' });
        return;
    }
    response.json(student);
});

router.post('/', (request, response, next) => {
    try {
        const { name, course, email } = request.body;
        if (!name || !course || !email) {
            response.status(400).json({ error: 'name, course, and email are required' });
            return;
        }
        response.status(201).json(database.addStudent({ name, course, email }));
    } catch (error) {
        next(error);
    }
});

router.put('/:id', (request, response, next) => {
    try {
        const updatedStudent = database.updateStudent(Number(request.params.id), request.body);
        if (!updatedStudent) {
            response.status(404).json({ error: 'Student not found' });
            return;
        }
        response.json(updatedStudent);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!database.getStudent(id)) {
        response.status(404).json({ error: 'Student not found' });
        return;
    }
    database.deleteStudent(id);
    response.json({ message: 'Student deleted' });
});

module.exports = router;