const express = require('express');
const database = require('./db');
const studentRoutes = require('./routes/students');

const app = express();
const port = Number(process.env.PORT) || 3008;

app.use(express.json());
app.get('/', (request, response) => {
    response.json({
        message: 'Node.js database connectivity practical',
        endpoint: '/students'
    });
});
app.use('/students', studentRoutes);
app.use((error, request, response, next) => {
    console.error(error.message);
    response.status(500).json({ error: 'Database operation failed' });
});

database.connect().then(() => {
    app.listen(port, () => {
        console.log(`Database app running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exitCode = 1;
});