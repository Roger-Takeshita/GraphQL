const ID = () => '_' + Math.random().toString(36).substr(2, 9);

const Mutations = {
    createUser(parent, args, { db: { users } }, info) {
        const emailTaken = users.some((user) => user.email === args.data.email);
        if (emailTaken) throw new Error('Email taken');

        const user = {
            id: ID(),
            ...args.data
        };
        users.push(user);
        return user;
    },
    deleteUser(parent, args, { db: { users, posts } }, info) {
        const userIndex = users.findIndex((user) => user.id === args.id);
        if (userIndex === -1) throw new Error('User not found');
        const deletedUsers = users.splice(userIndex, 1);
        posts = posts.filter((post) => {
            const match = post.author === args.id;
            if (match) comments = comments.filter((comment) => comment.post !== post.id);
            return !match;
        });
        comments = comments.filter((comment) => comment.author !== args.id);
        return deletedUsers[0];
    },
    updateUser(parent, { id, data }, { db: { users } }, info) {
        const user = users.find((user) => user.id === id);
        if (!user) throw new Error('User not found');
        if (typeof data.email === 'string') {
            const emailTaken = users.some((user) => user.email === data.email);
            if (emailTaken) throw new Error('Email in use');
            user.email = data.email;
        }
        if (typeof data.name === 'string') user.name = data.name;
        if (typeof data.age !== 'undefined') user.age = data.age;
        return user;
    },
    createPost(parent, args, { db: { users } }, info) {
        const userExists = users.some((user) => user.id === args.data.author);
        if (!userExists) throw new Error('User not found');
        const post = {
            id: ID(),
            ...args.data
        };
        posts.push(post);
        return post;
    },
    deletePost(parent, args, { db: { posts, comments } }, info) {
        const postIndex = posts.findIndex((post) => post.id === args.id);
        if (postIndex === -1) throw new Error('Post not found');
        const deletePosts = posts.splice(postIndex, 1);
        comments = comments.filter((comment) => comment.post !== args.id);
        return deletePosts[0];
    },
    updatePost(parent, { id, data }, { db: { posts } }) {
        const postExists = posts.find((post) => post.id === id);
        if (!postExists) throw new Error('Post not found');
        if (typeof data.title === 'string') postExists.title = data.title;
        if (typeof data.body === 'string') postExists.body = data.body;
        if (typeof data.published === 'boolean') postExists.published = data.published;
        return postExists;
    },
    createComment(parent, args, { db: { users, posts, comments } }, info) {
        const userExists = users.some((user) => user.id === args.data.author);
        const postExists = posts.some((post) => post.id === args.data.post);
        if (!postExists || !userExists) throw new Error('Unable to find user or post');
        const comment = {
            id: ID(),
            ...args.data
        };
        comments.push(comment);
        return comment;
    },
    deleteComment(parent, args, { db: { comments } }, info) {
        const commentIndex = comments.findIndex((comment) => comment.id === args.id);
        if (commentIndex === -1) throw new Error('Comment not found');
        const deleteComments = comments.splice(commentIndex, 1);
        return deleteComments[0];
    },
    updateComment(parent, { id, data }, { db: { comments } }) {
        const commentExist = comments.find((comment) => comment.id === id);
        if (!commentExist) throw new Error('Comment not found');
        if (typeof data.text === 'string') commentExist.text = data.text;
        return commentExist;
    }
};

export { Mutations as default };
