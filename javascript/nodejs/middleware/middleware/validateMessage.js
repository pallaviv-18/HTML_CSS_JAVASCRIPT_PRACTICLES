function validateMessage(request, response, next) {
    request.middlewareOrder.push('validateMessage');
    const { name, message } = request.body;

    if (!name || !message) {
        const error = new Error('name and message are required');
        error.statusCode = 400;
        next(error);
        return;
    }

    next();
}

module.exports = validateMessage;