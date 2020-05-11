import { GraphQLServer } from 'graphql-yoga';
import db from './database';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutations';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

//! Create the server
//+ The server expects an object as argument with:
//+     - typeDefs
//+     - resolvers
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    context: { db }
});

//! Start the server
server.start(() => {
    console.log('The Server is Running');
});
