const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { initialize } = require('./db/database');
const requestLogger = require('./middleware/logging');
const { notFound, errorHandler } = require('./middleware/errors');

const port = Number(process.env.PORT) || 3001;

async function start() {
    await initialize();
    const app = express();
    const authRoutes = require('./routes/auth');
    const studentRoutes = require('./routes/students');
    const productRoutes = require('./routes/products');
    const userRoutes = require('./routes/users');

    app.use(requestLogger);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(session({
        secret: process.env.SESSION_SECRET || 'development-session-secret-change-me',
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 1000 }
    }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/api/health', (request, response) => {
        response.json({ status: 'ok', message: 'Express application is running.' });
    });

    app.get('/api/preferences', (request, response) => {
        response.json({ theme: request.cookies.theme || 'light' });
    });

    app.post('/api/preferences', (request, response) => {
        response.cookie('theme', request.body.theme || 'light', { httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
        response.json({ message: 'Preference cookie saved.', theme: request.body.theme || 'light' });
    });

    app.delete('/api/preferences', (request, response) => {
        response.clearCookie('theme');
        response.json({ message: 'Preference cookie deleted.' });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/users', userRoutes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`Express app running at http://localhost:${port}`);
        console.log('Demo admin login: admin@example.com / Admin@123');
    });
}

start().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});