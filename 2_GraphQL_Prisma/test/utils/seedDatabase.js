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
    newUser() {
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
    newPost() {
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

class Comment {
    constructor(text, post) {
        this.text = text;
        this.post = post;
    }
    newComment() {
        return {
            input: {
                text: this.text
            },
            comment: undefined
        };
    }
}

const userOne = new User('Mike', 'mike@example.com', 'bananinha').newUser();
const userTwo = new User('Yumi', 'yumi@example.com', 'bananinha').newUser();
const postOne = new Post('Cabecinha published post 1', '', true).newPost();
const postTwo = new Post('Cabecinha not published post 2', '').newPost();
const commentUserOne = new Comment('Thank you Yumi', '').newComment();
const commentUserTwo = new Comment('Nice post Cabecinha', '').newComment();

const seedDatabase = async () => {
    //! Delete test data
    await prisma.mutation.deleteManyUsers();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyComments();
    //! Create users
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    });
    //! Save token
    userOne.token = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET, { expiresIn: '1 day' });
    userTwo.token = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET, { expiresIn: '1 day' });
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
    const commentUserOnePostOne = {
        data: {
            ...commentUserOne.input,
            post: {
                connect: {
                    id: postOne.post.id
                }
            },
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    };
    const commentUserTwoPostOne = {
        data: {
            ...commentUserTwo.input,
            post: {
                connect: {
                    id: postOne.post.id
                }
            },
            author: {
                connect: {
                    id: userTwo.user.id
                }
            }
        }
    };
    commentUserTwo.comment = await prisma.mutation.createComment(commentUserTwoPostOne);
    commentUserOne.comment = await prisma.mutation.createComment(commentUserOnePostOne);
};

export { seedDatabase as default, userOne, userTwo, postOne, postTwo, commentUserOne, commentUserTwo };
