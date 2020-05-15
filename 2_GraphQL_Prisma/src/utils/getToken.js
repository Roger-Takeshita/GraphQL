import jwt from 'jsonwebtoken';
const JWT_SECRET = 'MyJWT$3cr3t';

const getToken = (args) => {
    return jwt.sign(args, JWT_SECRET, { expiresIn: '1 day' });
};

export { getToken as default };
