import { GraphQLServer } from 'graphql-yoga';

const ID = () => '_' + Math.random().toString(36).substr(2, 9);

//! Demo user data
let users = [
    {
        id: '1',
        name: 'Roger',
        email: 'roger@gmail.com',
        age: 33
    },
    {
        id: '2',
        name: 'Yumi',
        email: 'ymi@gmail.com'
    },
    {
        id: '3',
        name: 'Mike',
        email: 'mike@gmail.com'
    }
];

let posts = [
    {
        id: '10',
        title: 'GraphQL 101',
        body: 'This is how to use GraphQL...',
        published: true,
        author: '1'
    },
    {
        id: '11',
        title: 'GraphQL 201',
        body: 'This is an advanced GraphQL post...',
        published: false,
        author: '1'
    },
    {
        id: '12',
        title: 'Programming Music',
        body: '',
        published: false,
        author: '2'
    }
];

let comments = [
    {
        id: '102',
        text: 'This worked well for me. Thanks!',
        author: '3',
        post: '10'
    },
    {
        id: '103',
        text: 'Glad you enjoyed it.',
        author: '1',
        post: '10'
    },
    {
        id: '104',
        text: 'This did no work.',
        author: '2',
        post: '11'
    },
    {
        id: '105',
        text: 'Nevermind. I got it to work.',
        author: '1',
        post: '12'
    }
];

//! Type definitions (Schema)
//! ! Always get type back
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

//! Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) return users;
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        me() {
            return {
                id: '123456',
                name: 'Mike',
                email: 'mike@gmail.com',
                age: null
            };
        },
        post() {
            return {
                id: '789',
                title: 'Harry Potter',
                body: 'Lorem text',
                published: false
            };
        },
        posts(parent, args, ctx, info) {
            if (!args.query) return posts;
            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            });
        },
        comments(parent, args, ctx, info) {
            return comments;
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email);
            if (emailTaken) throw new Error('Email taken');

            const user = {
                id: ID(),
                ...args.data
            };
            users.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
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
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author);
            if (!userExists) throw new Error('User not found');
            const post = {
                id: ID(),
                ...args.data
            };
            posts.push(post);
            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id);
            if (postIndex === -1) throw new Error('Post not found');
            const deletePosts = posts.splice(postIndex, 1);
            comments = comments.filter((comment) => comment.post !== args.id);
            return deletePosts[0];
        },
        createComment(parent, args, ctx, info) {
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
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id);
            if (commentIndex === -1) throw new Error('Comment not found');
            const deleteComments = comments.splice(commentIndex, 1);
            return deleteComments[0];
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id;
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post;
            });
        }
    }
};

//! Create the server
//+ The server expects an object as argument with:
//+     - typeDefs
//+     - resolvers
const server = new GraphQLServer({
    typeDefs,
    resolvers
});

//! Start the server
server.start(() => {
    console.log('The Server is Running');
});
