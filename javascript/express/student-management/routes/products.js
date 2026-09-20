const express = require('express');
const database = require('../db/database');
const { requireJwt, requireRole } = require('../middleware/auth');
const { requireFields, validateId } = require('../middleware/validation');

const router = express.Router();
router.use(requireJwt);

router.get('/', (request, response) => {
    response.json({ products: database.prepare('SELECT * FROM products ORDER BY id DESC').all() });
});

router.get('/:id', validateId, (request, response, next) => {
    const product = database.prepare('SELECT * FROM products WHERE id = ?').get(request.params.id);
    if (!product) {
        const error = new Error('Product not found.');
        error.statusCode = 404;
        return next(error);
    }
    response.json({ product });
});

router.post('/', requireRole('admin'), requireFields(['name', 'price', 'stock']), (request, response, next) => {
    try {
        const price = Number(request.body.price);
        const stock = Number(request.body.stock);
        if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
            const error = new Error('Price must be non-negative and stock must be a non-negative integer.');
            error.statusCode = 400;
            throw error;
        }
        const result = database.prepare('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)').run(request.body.name.trim(), price, stock);
        response.status(201).json({ product: database.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid) });
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', requireRole('admin'), validateId, (request, response, next) => {
    const product = database.prepare('SELECT * FROM products WHERE id = ?').get(request.params.id);
    if (!product) {
        const error = new Error('Product not found.');
        error.statusCode = 404;
        return next(error);
    }
    const name = request.body.name === undefined ? product.name : String(request.body.name).trim();
    const price = request.body.price === undefined ? product.price : Number(request.body.price);
    const stock = request.body.stock === undefined ? product.stock : Number(request.body.stock);
    if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
        const error = new Error('Invalid product values.');
        error.statusCode = 400;
        return next(error);
    }
    database.prepare('UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?').run(name, price, stock, request.params.id);
    response.json({ product: database.prepare('SELECT * FROM products WHERE id = ?').get(request.params.id) });
});

router.delete('/:id', requireRole('admin'), validateId, (request, response, next) => {
    const result = database.prepare('DELETE FROM products WHERE id = ?').run(request.params.id);
    if (!result.changes) {
        const error = new Error('Product not found.');
        error.statusCode = 404;
        return next(error);
    }
    response.status(204).end();
});

module.exports = router;