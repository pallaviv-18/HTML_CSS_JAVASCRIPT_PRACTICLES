function authenticate(request, response, next) {
    request.middlewareOrder.push('authenticate');

    if (request.get('x-api-key') !== (process.env.API_KEY || 'learning-key')) {
        const error = new Error('Valid x-api-key header required');
        error.statusCode = 401;
        next(error);
        return;
    }

    next();
}

module.exports = authenticate;