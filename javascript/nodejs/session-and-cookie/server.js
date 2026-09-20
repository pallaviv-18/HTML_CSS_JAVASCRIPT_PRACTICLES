const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const accountRoutes = require('./routes/account');
const cookieRoutes = require('./routes/cookies');

const app = express();
const port = Number(process.env.PORT) || 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'development-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 60 * 60 * 1000 }
}));

app.get('/', (request, response) => {
    response.json({
        message: 'Session and cookie management practical',
        routes: ['/account/login', '/account/logout', '/account/protected', '/cookies/create']
    });
});

app.use('/account', accountRoutes);
app.use('/cookies', cookieRoutes);

app.use((request, response) => {
    response.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Session app running at http://localhost:${port}`);
});