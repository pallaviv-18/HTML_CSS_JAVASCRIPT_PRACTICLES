const express = require('express');
const requestContext = require('./middleware/requestContext');
const logger = require('./middleware/logger');
const validateMessage = require('./middleware/validateMessage');
const authenticate = require('./middleware/authenticate');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = Number(process.env.PORT) || 3006;

app.use(express.json());
app.use(requestContext);
app.use(logger);

app.get('/', (request, response) => {
    response.json({
        message: 'Express middleware practical',
        middlewareOrder: request.middlewareOrder
    });
});

app.get('/api/order', (request, response) => {
    response.json({ middlewareOrder: request.middlewareOrder.concat('route') });
});

app.post('/api/messages', validateMessage, (request, response) => {
    response.status(201).json({
        message: 'Message accepted',
        data: request.body,
        middlewareOrder: request.middlewareOrder.concat('route')
    });
});

app.get('/api/protected', authenticate, (request, response) => {
    response.json({
        message: 'Protected data returned',
        middlewareOrder: request.middlewareOrder.concat('route')
    });
});

app.get('/api/fail', (request, response, next) => {
    const error = new Error('Demonstration error');
    error.statusCode = 500;
    next(error);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Middleware app running at http://localhost:${port}`);
});