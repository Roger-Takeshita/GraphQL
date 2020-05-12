import uuidv4 from 'uuid/v4';

const Mutations = {
    createUser(parent, { data }, { db: { users } }, info) {
        const emailTaken = users.some((user) => user.email === data.email);
        if (emailTaken) throw new Error('Email taken');

        const user = {
            id: uuidv4(),
            ...data
        };
        users.push(user);
        return user;
    },
    deleteUser(parent, { id }, { db: { users, posts } }, info) {
        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex === -1) throw new Error('User not found');
        const deletedUsers = users.splice(userIndex, 1);
        posts = posts.filter((post) => {
            const match = post.author === id;
            if (match) comments = comments.filter((comment) => comment.post !== post.id);
            return !match;
        });
        comments = comments.filter((comment) => comment.author !== id);
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
    createPost(parent, { data }, { db: { users, posts }, pubsub }, info) {
        const userExists = users.some((user) => user.id === data.author);
        if (!userExists) throw new Error('User not found');
        const post = {
            id: uuidv4(),
            ...data
        };
        posts.push(post);
        if (data.published)
            pubsub.publish(`POST`, {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        return post;
    },
    deletePost(parent, { id }, { db: { posts, comments }, pubsub }, info) {
        const postIndex = posts.findIndex((post) => post.id === id);
        if (postIndex === -1) throw new Error('Post not found');
        const [post] = posts.splice(postIndex, 1);
        comments = comments.filter((comment) => comment.post !== id);
        if (post.published) {
            pubsub.publish('POST', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            });
        }
        return post;
    },
    updatePost(parent, { id, data }, { db: { posts }, pubsub }) {
        const post = posts.find((post) => post.id === id);
        const originalPost = { ...post };
        if (!post) throw new Error('Post not found');
        if (typeof data.title === 'string') post.title = data.title;
        if (typeof data.body === 'string') post.body = data.body;
        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                pubsub.publish('POST', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && post.published) {
                pubsub.publish('POST', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            }
        } else if (post.published) {
            pubsub.publish('POST', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }
        return post;
    },
    createComment(parent, { data }, { db: { users, posts, comments }, pubsub }, info) {
        const userExists = users.some((user) => user.id === data.author);
        const postExists = posts.some((post) => post.id === data.post);
        if (!postExists || !userExists) throw new Error('Unable to find user or post');
        const comment = {
            id: uuidv4(),
            ...data
        };
        comments.push(comment);
        pubsub.publish(`COMMENT ${data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });
        return comment;
    },
    deleteComment(parent, { id }, { db: { comments }, pubsub }, info) {
        const commentIndex = comments.findIndex((comment) => comment.id === id);
        if (commentIndex === -1) throw new Error('Comment not found');
        const [deletedComment] = comments.splice(commentIndex, 1);
        pubsub.publish(`COMMENT ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        });
        return deletedComment;
    },
    updateComment(parent, { id, data }, { db: { comments }, pubsub }) {
        const commentExist = comments.find((comment) => comment.id === id);
        if (!commentExist) throw new Error('Comment not found');
        if (typeof data.text === 'string') commentExist.text = data.text;
        pubsub.publish(`COMMENT ${commentExist.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: commentExist
            }
        });
        return commentExist;
    }
};

export { Mutations as default };
