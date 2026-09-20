function logger(request, response, next) {
    request.middlewareOrder.push('logger');
    const startedAt = Date.now();

    response.on('finish', () => {
        console.log(`${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms`);
    });

    next();
}

module.exports = logger;