const express = require('express');
const { getDatabase, saveDatabase } = require('./db');

const app = express();
const port = Number(process.env.PORT) || 3006;
app.use(express.json());

const resources = {
    students: ['name', 'email', 'course'],
    users: ['name', 'email'],
    products: ['name', 'price']
};

function validate(resource, body) {
    const fields = resources[resource];
    if (!fields) return 'Unknown resource.';
    if (fields.some((field) => body[field] === undefined || body[field] === '')) return `Required fields: ${fields.join(', ')}.`;
    if (resource === 'products' && (typeof body.price !== 'number' || body.price < 0)) return 'Price must be a non-negative number.';
    return null;
}

app.get('/', (request, response) => response.json({ message: 'CRUD API', resources: Object.keys(resources) }));

app.get('/:resource', async (request, response) => {
    const database = await getDatabase();
    if (!resources[request.params.resource]) return response.status(404).json({ error: 'Resource not found.' });
    const result = database.exec(`SELECT * FROM ${request.params.resource}`);
    const rows = result[0] ? result[0].values.map((values) => Object.fromEntries(values.map((value, index) => [result[0].columns[index], value]))) : [];
    response.json(rows);
});

app.get('/:resource/:id', async (request, response) => {
    const database = await getDatabase();
    const { resource, id } = request.params;
    if (!resources[resource]) return response.status(404).json({ error: 'Resource not found.' });
    const result = database.exec(`SELECT * FROM ${resource} WHERE id = ${Number(id) || 0}`);
    if (!result[0] || !result[0].values.length) return response.status(404).json({ error: 'Record not found.' });
    response.json(Object.fromEntries(result[0].values[0].map((value, index) => [result[0].columns[index], value])));
});

app.post('/:resource', async (request, response) => {
    const { resource } = request.params;
    const error = validate(resource, request.body);
    if (error) return response.status(400).json({ error });
    const database = await getDatabase();
    const fields = resources[resource];
    try {
        const values = fields.map((field) => request.body[field]);
        database.run(`INSERT INTO ${resource} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`, values);
        saveDatabase();
        const id = database.exec(`SELECT id FROM ${resource} ORDER BY id DESC LIMIT 1`)[0].values[0][0];
        response.status(201).json({ id, ...request.body });
    } catch (error) { response.status(409).json({ error: error.message }); }
});

app.put('/:resource/:id', async (request, response) => {
    const { resource, id } = request.params;
    const error = validate(resource, request.body);
    if (error) return response.status(400).json({ error });
    const database = await getDatabase();
    const fields = resources[resource];
    database.run(`UPDATE ${resource} SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = ?`, [...fields.map((field) => request.body[field]), Number(id) || 0]);
    if (!database.getRowsModified()) return response.status(404).json({ error: 'Record not found.' });
    saveDatabase();
    response.json({ id: Number(id), ...request.body });
});

app.delete('/:resource/:id', async (request, response) => {
    const { resource, id } = request.params;
    if (!resources[resource]) return response.status(404).json({ error: 'Resource not found.' });
    const database = await getDatabase();
    database.run(`DELETE FROM ${resource} WHERE id = ?`, [Number(id) || 0]);
    if (!database.getRowsModified()) return response.status(404).json({ error: 'Record not found.' });
    saveDatabase();
    response.status(204).end();
});

app.use((request, response) => response.status(404).json({ error: 'Route not found.' }));
app.use((error, request, response, next) => response.status(500).json({ error: error.message }));

app.listen(port, () => console.log(`CRUD API running at http://localhost:${port}`));