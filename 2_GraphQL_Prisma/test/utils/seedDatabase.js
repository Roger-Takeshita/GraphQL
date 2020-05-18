import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';
const BCRYPT_SALT = 6;

const userOne = {
    input: {
        name: 'Mike',
        email: 'mike@example.com',
        password: bcrypt.hashSync('bananinha', BCRYPT_SALT)
    },
    user: undefined,
    token: undefined
};

const seedDatabase = async () => {
    //! Delete test data
    await prisma.mutation.deleteManyUsers();
    await prisma.mutation.deleteManyPosts();
    //! Create user
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    //! Save token
    userOne.token = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);
    //! Create posts
    const publishedPost = {
        data: {
            title: 'Cabecinha published post',
            body: '',
            published: true,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    };
    const notPublishedPost = {
        data: {
            title: 'Cabecinha draft post',
            body: '',
            published: false,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    };
    await prisma.mutation.createPost(publishedPost);
    await prisma.mutation.createPost(notPublishedPost);
};

export { seedDatabase as default, userOne };
