import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';
const BCRYPT_SALT = 6;

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    newObject() {
        return {
            input: {
                name: this.name,
                email: this.email,
                password: bcrypt.hashSync(this.password, BCRYPT_SALT)
            },
            user: undefined,
            token: undefined
        };
    }
}

class Post {
    constructor(title, body, published = false) {
        this.title = title;
        this.body = body;
        this.published = published;
    }
    newObject() {
        return {
            input: {
                title: this.title,
                body: this.body,
                published: this.published
            },
            post: undefined
        };
    }
}

const userOne = new User('Mike', 'mike@example.com', 'bananinha').newObject();
const postOne = new Post('Cabecinha published post 1', '', true).newObject();
const postTwo = new Post('Cabecinha not published post 2', '').newObject();

const seedDatabase = async () => {
    //! Delete test data
    await prisma.mutation.deleteManyUsers();
    await prisma.mutation.deleteManyPosts();
    //! Create user
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    //! Save token
    userOne.token = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET, { expiresIn: '1 day' });
    //! Create posts
    //+ Post 1
    const publishedPost = {
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    };
    //+ Post 2
    const notPublishedPost = {
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    };
    postOne.post = await prisma.mutation.createPost(publishedPost);
    postTwo.post = await prisma.mutation.createPost(notPublishedPost);
};

export { seedDatabase as default, userOne, postOne, postTwo };
