const express = require('express');
const path = require('node:path');
const webRoutes = require('./routes/web');

const app = express();
const port = Number(process.env.PORT) || 3004;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', webRoutes);

app.use((request, response) => {
    response.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Express app running at http://localhost:${port}`);
});