import jwt from 'jsonwebtoken';

const getToken = (args) => {
    return jwt.sign(args, process.env.JWT_SECRET, { expiresIn: '1 day' });
};

export { getToken as default };
