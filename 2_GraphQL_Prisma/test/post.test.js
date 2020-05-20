import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { getPosts, updatePost, createPost, deletePost } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should expose public posts (only)', async () => {
    const response = await client.query({ query: getPosts });
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
});

test('Should be able to update own post', async () => {
    const client = getClient(userOne.token);
    const variables = {
        id: postOne.post.id,
        data: {
            published: false
        }
    };
    const { data } = await client.mutate({ mutation: updatePost, variables });
    const updatedPost = await prisma.exists.Post({ id: postOne.post.id, published: false });
    expect(data.updatePost.published).toBe(false);
    expect(updatedPost).toBe(true);
});

test('Should create a new post', async () => {
    const client = getClient(userOne.token);
    const variables = {
        data: {
            title: 'My new post',
            body: 'My new body',
            published: true
        }
    };
    const { data } = await client.mutate({ mutation: createPost, variables });
    const postExists = await prisma.exists.Post({ id: data.createPost.id });
    expect(data.createPost.title).toBe('My new post');
    expect(data.createPost.body).toBe('My new body');
    expect(data.createPost.published).toBe(true);
    expect(postExists).toBe(true);
});

test('Should delete a post', async () => {
    const client = getClient(userOne.token);
    const variables = {
        id: postTwo.post.id
    };
    await client.mutate({ mutation: deletePost, variables });
    const postExists = await prisma.exists.Post({ id: postTwo.post.id });
    expect(postExists).toBe(false);
});

// test('', async () => {});
