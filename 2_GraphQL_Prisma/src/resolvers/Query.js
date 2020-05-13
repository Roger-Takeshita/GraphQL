const Query = {
    users(parent, { query }, { prisma }, info) {
        const opArgs = {};
        if (query) {
            opArgs.where = {
                OR: [{ name_contains: query }, { email_contains: query }]
            };
        }
        return prisma.query.users(opArgs, info);
    },
    posts(parent, { query }, { prisma }, info) {
        const opArgs = {};
        if (query) {
            opArgs.where = {
                OR: [{ title_contains: query }, { body_contains: query }]
            };
        }

        return prisma.query.posts(opArgs, info);
    },
    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info);
    },
    me() {
        return {
            id: '123',
            name: 'Thaisa',
            email: 'thaisa@gmail.com'
        };
    },
    post() {
        return {
            id: '123',
            title: 'GraphQL 101',
            body: '',
            published: false
        };
    }
};

export { Query as default };
