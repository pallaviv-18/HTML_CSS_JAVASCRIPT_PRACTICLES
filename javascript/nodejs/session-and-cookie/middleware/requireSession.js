function requireSession(request, response, next) {
    if (!request.session.user) {
        response.status(401).json({ error: 'Please log in first.' });
        return;
    }

    next();
}

module.exports = requireSession;