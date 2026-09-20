const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'development-secret-change-me';

function requireSession(request, response, next) {
    console.log('[middleware 3: session auth] checking session');
    if (!request.session.user) {
        return response.status(401).json({ error: 'Login required.' });
    }
    request.currentUser = request.session.user;
    next();
}

function requireJwt(request, response, next) {
    const header = request.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
        return response.status(401).json({ error: 'Bearer token required.' });
    }

    try {
        request.currentUser = jwt.verify(token, jwtSecret);
        next();
    } catch (error) {
        const authError = new Error('Invalid or expired token.');
        authError.statusCode = 401;
        next(authError);
    }
}

function requireRole(...roles) {
    return (request, response, next) => {
        if (!request.currentUser || !roles.includes(request.currentUser.role)) {
            return response.status(403).json({ error: 'You do not have permission for this action.' });
        }
        next();
    };
}

module.exports = { jwtSecret, requireSession, requireJwt, requireRole };