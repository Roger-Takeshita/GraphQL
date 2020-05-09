import { GraphQLServerLambda, GraphQLServer } from 'graphql-yoga';

//! Demo user data
const users = [
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

const posts = [
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

const comments = [
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
        post: '11'
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
