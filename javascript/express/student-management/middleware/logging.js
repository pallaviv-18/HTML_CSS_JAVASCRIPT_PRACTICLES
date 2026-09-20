function requestLogger(request, response, next) {
    const startedAt = Date.now();
    console.log(`[middleware 1: logger] ${request.method} ${request.originalUrl}`);
    response.on('finish', () => {
        console.log(`${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms`);
    });
    next();
}

module.exports = requestLogger;