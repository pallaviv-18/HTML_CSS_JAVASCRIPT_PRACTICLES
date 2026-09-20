function requireFields(fields) {
    return (request, response, next) => {
        const missingFields = fields.filter((field) => {
            const value = request.body[field];
            return value === undefined || value === null || String(value).trim() === '';
        });

        if (missingFields.length) {
            const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
            error.statusCode = 400;
            return next(error);
        }
        console.log('[middleware 2: validation] request body is valid');
        next();
    };
}

function validateId(request, response, next) {
    if (!Number.isInteger(Number(request.params.id)) || Number(request.params.id) < 1) {
        const error = new Error('Route id must be a positive integer.');
        error.statusCode = 400;
        return next(error);
    }
    next();
}

module.exports = { requireFields, validateId };