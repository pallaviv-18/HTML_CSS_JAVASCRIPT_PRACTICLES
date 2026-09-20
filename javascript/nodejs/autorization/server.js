const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase, saveDatabase } = require('./db');

const app = express();
const port = Number(process.env.PORT) || 3008;
const secret = process.env.JWT_SECRET || 'authorization-development-secret';
app.use(express.json());

const fields = {
    students: ['name', 'email'],
    products: ['name', 'price']
};

function validate(resource, body) {
    if (!fields[resource]) return 'Resource not found.';
    if (fields[resource].some((field) => body[field] === undefined || body[field] === '')) return `Required fields: ${fields[resource].join(', ')}.`;
    if (resource === 'products' && (typeof body.price !== 'number' || body.price < 0)) return 'Price must be a non-negative number.';
    return null;
}

async function findUser(email) {
    const database = await getDatabase();
    const result = database.exec(`SELECT * FROM users WHERE email = '${String(email).replaceAll("'", "''")}'`);
    return result[0]?.values[0] ? Object.fromEntries(result[0].values[0].map((value, index) => [result[0].columns[index], value])) : null;
}

function authenticate(request, response, next) {
    const token = request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7) : '';
    try { request.user = jwt.verify(token, secret); next(); } catch { response.status(401).json({ error: 'Authentication required.' }); }
}

function authorize(...roles) {
    return (request, response, next) => roles.includes(request.user.role) ? next() : response.status(403).json({ error: 'Insufficient permissions.' });
}

app.get('/', (request, response) => response.json({ message: 'Authorization and REST API', routes: ['/register', '/login', '/students', '/products', '/users'] }));
app.post('/register', async (request, response, next) => {
    try {
        const { name, email, password, role = 'user' } = request.body;
        if (!name || !email || !password || password.length < 6 || !['user', 'admin'].includes(role)) return response.status(400).json({ error: 'Valid name, email, password (6+), and role are required.' });
        if (await findUser(email)) return response.status(409).json({ error: 'User already exists.' });
        const database = await getDatabase();
        const passwordHash = await bcrypt.hash(password, 10);
        database.run('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, passwordHash, role]);
        saveDatabase();
        response.status(201).json({ message: 'User registered.' });
    } catch (error) { next(error); }
});

app.post('/login', async (request, response, next) => {
    try {
        const user = await findUser(request.body.email);
        if (!user || !request.body.password || !(await bcrypt.compare(request.body.password, user.password_hash))) return response.status(401).json({ error: 'Invalid credentials.' });
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, secret, { expiresIn: '1h' });
        response.json({ token });
    } catch (error) { next(error); }
});

app.get('/users', authenticate, authorize('admin'), async (request, response, next) => {
    try { const database = await getDatabase(); const result = database.exec('SELECT id, name, email, role FROM users'); response.json(result[0]?.values || []); } catch (error) { next(error); }
});

for (const resource of Object.keys(fields)) {
    app.get(`/${resource}`, authenticate, async (request, response, next) => {
        try { const database = await getDatabase(); const result = database.exec(`SELECT * FROM ${resource}`); response.json(result[0]?.values || []); } catch (error) { next(error); }
    });
    app.post(`/${resource}`, authenticate, async (request, response, next) => {
        try {
            const error = validate(resource, request.body);
            if (error) return response.status(400).json({ error });
            const database = await getDatabase();
            database.run(`INSERT INTO ${resource} (${fields[resource].join(', ')}) VALUES (${fields[resource].map(() => '?').join(', ')})`, fields[resource].map((field) => request.body[field]));
            saveDatabase();
            const id = database.exec(`SELECT id FROM ${resource} ORDER BY id DESC LIMIT 1`)[0].values[0][0];
            response.status(201).json({ id, ...request.body });
        } catch (error) { next(error); }
    });
    app.put(`/${resource}/:id`, authenticate, async (request, response, next) => {
        try {
            const error = validate(resource, request.body);
            if (error) return response.status(400).json({ error });
            const database = await getDatabase();
            database.run(`UPDATE ${resource} SET ${fields[resource].map((field) => `${field} = ?`).join(', ')} WHERE id = ?`, [...fields[resource].map((field) => request.body[field]), Number(request.params.id) || 0]);
            if (!database.getRowsModified()) return response.status(404).json({ error: 'Record not found.' });
            saveDatabase(); response.json({ id: Number(request.params.id), ...request.body });
        } catch (error) { next(error); }
    });
    app.delete(`/${resource}/:id`, authenticate, authorize('admin'), async (request, response, next) => {
        try { const database = await getDatabase(); database.run(`DELETE FROM ${resource} WHERE id = ?`, [Number(request.params.id) || 0]); if (!database.getRowsModified()) return response.status(404).json({ error: 'Record not found.' }); saveDatabase(); response.status(204).end(); } catch (error) { next(error); }
    });
}

app.use((request, response) => response.status(404).json({ error: 'API route not found.' }));
app.use((error, request, response, next) => response.status(500).json({ error: 'Internal server error.', details: error.message }));
app.listen(port, () => console.log(`Authorization API running at http://localhost:${port}`));