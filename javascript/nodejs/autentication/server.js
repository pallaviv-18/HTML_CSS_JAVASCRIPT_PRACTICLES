const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = Number(process.env.PORT) || 3007;
const secret = process.env.JWT_SECRET || 'development-secret-change-me';
const users = [];
const sessions = new Set();
app.use(express.json());

app.get('/', (request, response) => response.json({ message: 'Authentication API', routes: ['/register', '/login', '/logout', '/api/profile'] }));
app.post('/register', async (request, response) => {
    const { email, password } = request.body;
    if (!email || !password || password.length < 6) return response.status(400).json({ error: 'Email and a password of at least 6 characters are required.' });
    if (users.some((user) => user.email === email)) return response.status(409).json({ error: 'User already exists.' });
    users.push({ id: users.length + 1, email, passwordHash: await bcrypt.hash(password, 10) });
    response.status(201).json({ message: 'Registration successful.' });
});
app.post('/login', async (request, response) => {
    const user = users.find((candidate) => candidate.email === request.body.email);
    if (!user || !(await bcrypt.compare(request.body.password || '', user.passwordHash))) return response.status(401).json({ error: 'Invalid credentials.' });
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });
    sessions.add(token);
    response.json({ message: 'Login successful.', token });
});
function requireAuth(request, response, next) {
    const token = request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7) : '';
    try {
        if (!sessions.has(token)) throw new Error('Session is not active.');
        request.user = jwt.verify(token, secret);
        next();
    } catch { response.status(401).json({ error: 'Authentication required.' }); }
}
app.post('/logout', requireAuth, (request, response) => { sessions.delete(request.headers.authorization.slice(7)); response.json({ message: 'Logout successful.' }); });
app.get('/api/profile', requireAuth, (request, response) => response.json({ user: request.user }));
app.use((request, response) => response.status(404).json({ error: 'Route not found.' }));
app.listen(port, () => console.log(`Authentication API running at http://localhost:${port}`));