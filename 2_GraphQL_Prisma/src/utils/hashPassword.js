import bcrypt from 'bcryptjs';
const BCRYPT_SALT = 6;

const hashPassword = (password) => {
    if (password.length < 8) throw new Error('Password must be 8 characters or longer');
    return bcrypt.hash(password, BCRYPT_SALT);
};

const comparePassword = (password, userPassword) => {
    if (password.length < 8) throw new Error('Password must be 8 characters or longer');
    return bcrypt.compare(password, userPassword);
};

export { comparePassword, hashPassword };
