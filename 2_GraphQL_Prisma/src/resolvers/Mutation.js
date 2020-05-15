import getUserId from '../utils/getUserId';
import getToken from '../utils/getToken';
import { hashPassword, comparePassword } from '../utils/hashPassword';

const Mutations = {
    async createUser(parent, { data }, { prisma }, info) {
        const password = await hashPassword(data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...data,
                password
            }
        });
        console.log(user);
        return {
            user,
            token: getToken({ userId: user.id })
        };
    },
    async loginUser(parent, { data }, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: data.email
            }
        });
        if (!user) throw new Error('Bad credentials');
        const isMatch = await comparePassword(data.password, user.password);
        if (!isMatch) throw new Error('Bad credentials');
        return {
            user,
            token: getToken({ userId: user.id })
        };
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.deleteUser({ where: { id: userId } }, info);
    },
    async updateUser(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);
        if (typeof data.password === 'string') data.password = await hashPassword(data.password);
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

        const isPublished = await prisma.exists.Post({ id, published: true });
        if (isPublished && data.published === false)
            await prisma.mutation.deleteManyComments({ where: { post: { id } } });
        return prisma.mutation.updatePost({
            data: { ...data },
            where: { id }
        });
    },
    async createComment(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);
        const postExists = await prisma.exists.Post({
            id: data.post,
            published: true
        });
        if (!postExists) throw new Error('Post not found');
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
