const express = require('express');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const studentRoutes = require('./routes/students');

const app = express();
const port = Number(process.env.PORT) || 3005;

app.get('/', (request, response) => {
    response.json({
        message: 'Express routing practical',
        routes: ['/about', '/users', '/products', '/students']
    });
});

app.get('/about', (request, response) => {
    response.send('<h1>Express Routing</h1><p>This is a basic Express route.</p>');
});

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/students', studentRoutes);

app.use((request, response) => {
    response.status(404).json({
        error: 'Not Found',
        path: request.originalUrl,
        message: 'The requested route does not exist.'
    });
});

app.listen(port, () => {
    console.log(`Routing app running at http://localhost:${port}`);
});