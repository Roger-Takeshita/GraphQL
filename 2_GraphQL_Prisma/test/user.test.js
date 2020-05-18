import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
    const createUser = gql`
        mutation {
            createUser(
                data: { name: "Roger Takeshita", email: "roger1@example.com", password: "bananinha" }
            ) {
                user {
                    id
                    name
                }
                token
            }
        }
    `;
    const response = await client.mutate({
        mutation: createUser
    });
    const userExists = await prisma.exists.User({ id: response.data.createUser.user.id });
    expect(userExists).toBe(true);
});

test('Should expose public author profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `;
    const response = await client.query({ query: getUsers });
    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Mike');
});

test('Should not login with bad credentials', async () => {
    const login = gql`
        mutation {
            loginUser(data: { email: "mike@example.com", password: "cabecinha" }) {
                token
            }
        }
    `;
    await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test('Should not signup user with invalid password', async () => {
    const signup = gql`
        mutation {
            createUser(data: { name: "Yumi", email: "yumi@example.com", password: "uva" }) {
                token
            }
        }
    `;
    await expect(client.mutate({ mutation: signup })).rejects.toThrow();
});

test('Should fetch user profile', async () => {
    const client = getClient(userOne.token);
    const getProfile = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `;
    const { data } = await client.query({ query: getProfile });
    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
});

// test('', async () => {});
