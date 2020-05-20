import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, getUsers, login, getProfile, getMyPosts } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: 'Roger Takeshita',
            email: 'roger1@example.com',
            password: 'bananinha'
        }
    };
    const response = await client.mutate({
        mutation: createUser,
        variables
    });
    const userExists = await prisma.exists.User({ id: response.data.createUser.user.id });
    expect(userExists).toBe(true);
});

test('Should expose public author profiles', async () => {
    const response = await client.query({ query: getUsers });
    expect(response.data.users.length).toBe(2);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Mike');
});

test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: 'mike@example.com',
            password: 'bananinha123'
        }
    };
    await expect(
        client.mutate({
            mutation: login,
            variables
        })
    ).rejects.toThrow();
});

test('Should not signup user with invalid password', async () => {
    const variables = {
        data: {
            name: 'Yumi',
            email: 'yumi@example.com',
            password: 'uva'
        }
    };
    await expect(
        client.mutate({
            mutation: createUser,
            variables
        })
    ).rejects.toThrow();
});

test('Should fetch user profile', async () => {
    const client = getClient(userOne.token);
    const { data } = await client.query({ query: getProfile });
    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
});

test('Should fetch users posts - authenticated', async () => {
    const client = getClient(userOne.token);
    const { data } = await client.query({ query: getMyPosts });
    expect(data.myPosts.length).toBe(2);
});

// test('', async () => {});
