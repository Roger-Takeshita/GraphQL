import uuidv4 from 'uuid/v4';

const Mutations = {
    createUser(parent, { data }, { prisma }, info) {
        return prisma.mutation.createUser({ data }, info);
    },
    deleteUser(parent, { id }, { prisma }, info) {
        return prisma.mutation.deleteUser({ where: { id } }, info);
    },
    updateUser(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updateUser({ data: data, where: { id } }, info);
    },
    createPost(parent, { data }, { prisma, pubsub }, info) {
        return prisma.mutation.createPost(
            {
                data: {
                    title: data.title,
                    body: data.body,
                    published: data.published,
                    author: {
                        connect: {
                            id: data.author
                        }
                    }
                }
            },
            info
        );
    },
    deletePost(parent, { id }, { prisma, pubsub }, info) {
        return prisma.mutation.deletePost({ where: { id } }, info);
    },
    updatePost(parent, { id, data }, { prisma, pubsub }) {
        return prisma.mutation.updatePost({
            data: { ...data },
            where: { id }
        });
    },
    createComment(parent, { data }, { prisma, pubsub }, info) {
        return prisma.mutation.createComment(
            {
                data: {
                    text: data.text,
                    author: { connect: { id: data.author } },
                    post: { connect: { id: data.post } }
                }
            },
            info
        );
    },
    deleteComment(parent, { id }, { prisma, pubsub }, info) {
        return prisma.mutation.deleteComment({ where: { id } }, info);
    },
    updateComment(parent, { id, data }, { prisma, pubsub }, info) {
        return prisma.mutation.updateComment({ data, where: { id } }, info);
    }
};

export { Mutations as default };
