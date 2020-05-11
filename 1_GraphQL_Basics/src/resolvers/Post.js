const Post = {
    author(parent, args, { db: { users } }, info) {
        return users.find((user) => {
            return user.id === parent.author;
        });
    },
    comments(parent, args, { db: { comments } }, info) {
        return comments.filter((comment) => {
            return comment.post === parent.id;
        });
    }
};

export { Post as default };
