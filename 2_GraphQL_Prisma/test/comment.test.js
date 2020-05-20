import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, commentUserOne, commentUserTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { deleteComment, subscribeToComments, subscribeToPosts } from './utils/operations';

beforeEach(seedDatabase);

test('Should delete own comment', async () => {
    const client = getClient(userOne.token);
    const variables = {
        id: commentUserOne.comment.id
    };
    await client.mutate({ mutation: deleteComment, variables });
    const commentExists = await prisma.exists.Comment({ id: commentUserOne.comment.id });
    expect(commentExists).toBe(false);
});

test('Should delete not delete other users comment', async () => {
    const client = getClient(userOne.token);
    const variables = {
        id: commentUserTwo.comment.id
    };
    await expect(
        client.mutate({
            mutation: deleteComment,
            variables
        })
    ).rejects.toThrow();
});

test('Should subscribe to comments for a post', async (done) => {
    const client = getClient(userOne.token);
    const variables = {
        postId: postOne.post.id
    };

    client.subscribe({ query: subscribeToComments, variables }).subscribe({
        next(response) {
            expect(response.data.comment.mutation).toBe('DELETED');
            done();
        }
    });

    await prisma.mutation.deleteComment({ where: { id: commentUserOne.comment.id } });
});

test('Should subscribe to changes for published posts', async (done) => {
    client.subscribe({ query: subscribeToPosts }).subscribe({
        next(response) {
            expect(response.data.post.mutation).toBe('DELETED');
            done();
        }
    });

    await prisma.mutation.deletePost({ where: { id: postOne.post.id } });
});

// test('   ', async () => { });
