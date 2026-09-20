const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    const category = request.query.category || 'all';
    const limit = Number(request.query.limit) || 10;

    response.json({
        resource: 'products',
        category,
        limit,
        message: 'Category and limit came from query parameters.'
    });
});

router.get('/:productId', (request, response) => {
    response.json({
        resource: 'products',
        productId: request.params.productId
    });
});

module.exports = router;