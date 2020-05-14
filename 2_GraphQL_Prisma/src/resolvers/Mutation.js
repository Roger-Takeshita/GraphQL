import jwt from 'jsonwebtoken';
const JWT_SECRET = 'MyJWT$3cr3t';
import bcrypt from 'bcryptjs';
const BYCRYPT_SALT = 6;
import getUserId from '../utils/getUserId';

const Mutations = {
    async createUser(parent, { data }, { prisma }, info) {
        if (data.password.length < 8) throw new Error('Password must be 8 characters or longer');
        const password = await bcrypt.hash(data.password, BYCRYPT_SALT);
        const user = await prisma.mutation.createUser({
            data: {
                ...data,
                password
            }
        });
        console.log(user);
        return {
            user,
            token: jwt.sign({ userId: user.id }, JWT_SECRET)
        };
    },
    async loginUser(parent, { data }, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: data.email
            }
        });
        if (!user) throw new Error('Bad credentials');
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error('Bad credentials');
        return {
            user,
            token: jwt.sign({ userId: user.id }, JWT_SECRET)
        };
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.deleteUser({ where: { id: userId } }, info);
    },
    updateUser(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.updateUser({ data: data, where: { id: userId } }, info);
    },
    createPost(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.createPost(
            {
                data: {
                    title: data.title,
                    body: data.body,
                    published: data.published,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            },
            info
        );
    },
    async deletePost(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        });
        if (!postExists) throw new Error('Post not found');
        return prisma.mutation.deletePost({ where: { id } }, info);
    },
    async updatePost(parent, { id, data }, { prisma, request }) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        });
        if (!postExists) throw new Error('Post not found');
        return prisma.mutation.updatePost({
            data: { ...data },
            where: { id }
        });
    },
    createComment(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.createComment(
            {
                data: {
                    text: data.text,
                    author: { connect: { id: userId } },
                    post: { connect: { id: data.post } }
                }
            },
            info
        );
    },
    async deleteComment(parent, { id }, { prisma, request }, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id,
            author: {
                id: userId
            }
        });
        if (!commentExists) throw new Error('Comment not found');
        return prisma.mutation.deleteComment({ where: { id } }, info);
    },
    async updateComment(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request);
        const commentExists = await prisma.exists.Comment({
            id,
            author: {
                id: userId
            }
        });
        if (!commentExists) throw new Error('Comment not found');
        return prisma.mutation.updateComment({ data, where: { id } }, info);
    }
};

export { Mutations as default };
