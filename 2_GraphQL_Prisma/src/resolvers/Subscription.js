const Subscription = {
    comment: {
        subscribe(parent, { postId }, { db: { posts }, pubsub }, info) {
            const post = posts.find((post) => post.id == postId && post.published);
            if (!post) throw new Error('Post not found');
            return pubsub.asyncIterator(`COMMENT ${postId}`);
        }
    },
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator(`POST`);
        }
    }
};

export { Subscription as default };
