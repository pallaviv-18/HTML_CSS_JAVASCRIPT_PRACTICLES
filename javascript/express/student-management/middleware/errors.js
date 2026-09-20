function notFound(request, response) {
    response.status(404).json({ error: `Route not found: ${request.method} ${request.originalUrl}` });
}

function errorHandler(error, request, response, next) {
    console.error(error.stack || error.message);
    if (response.headersSent) return next(error);
    const statusCode = error.statusCode || (error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 500);
    response.status(statusCode).json({ error: statusCode === 500 ? 'Internal server error.' : error.message });
}

module.exports = { notFound, errorHandler };