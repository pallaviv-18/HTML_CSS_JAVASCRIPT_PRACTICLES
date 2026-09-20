function errorHandler(error, request, response, next) {
    const statusCode = error.statusCode || 500;
    console.error('Handled error:', error.message);
    response.status(statusCode).json({
        error: error.message,
        middlewareOrder: request.middlewareOrder || []
    });
}

module.exports = errorHandler;