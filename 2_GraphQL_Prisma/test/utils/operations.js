import { gql } from 'apollo-boost';

const createUser = gql`
    mutation($data: CreateUserInput!) {
        createUser(data: $data) {
            user {
                id
                name
            }
            token
        }
    }
`;

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`;

const login = gql`
    mutation($data: LoginUserInput) {
        loginUser(data: $data) {
            token
        }
    }
`;

const getProfile = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;

const getPosts = gql`
    query {
        posts {
            id
            title
            body
            published
        }
    }
`;

const getMyPosts = gql`
    query {
        myPosts {
            id
            title
            published
            author {
                name
            }
        }
    }
`;

const updatePost = gql`
    mutation($id: ID!, $data: UpdatePostInput) {
        updatePost(id: $id, data: $data) {
            id
            title
            body
            published
        }
    }
`;

const createPost = gql`
    mutation($data: CreatePostInput) {
        createPost(data: $data) {
            id
            title
            body
            published
        }
    }
`;

const deletePost = gql`
    mutation($id: ID!) {
        deletePost(id: $id) {
            id
        }
    }
`;

export { createUser, getUsers, login, getProfile, getMyPosts, getPosts, updatePost, createPost, deletePost };
