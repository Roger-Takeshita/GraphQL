import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
    const header = request.request
        ? request.request.headers.authorization
        : request.connection.context.Authorization;
    if (header) {
        const token = header.replace('Baerer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) throw new Error('Bad token');
        return decoded.userId;
    }
    if (requireAuth) throw new Error('Authentication is required');
    return null;
};

export { getUserId as default };
