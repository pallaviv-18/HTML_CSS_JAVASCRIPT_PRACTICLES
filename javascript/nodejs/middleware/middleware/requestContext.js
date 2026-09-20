function requestContext(request, response, next) {
    request.middlewareOrder = ['requestContext'];
    request.requestStartedAt = new Date().toISOString();
    next();
}

module.exports = requestContext;