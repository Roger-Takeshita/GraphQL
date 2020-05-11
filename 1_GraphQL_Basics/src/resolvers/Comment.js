const Comment = {
    author(parent, args, { db: { users } }, info) {
        return users.find((user) => {
            return user.id === parent.author;
        });
    },
    post(parent, args, { db: { posts } }, info) {
        return posts.find((post) => {
            return post.id === parent.post;
        });
    }
};

export { Comment as default };
