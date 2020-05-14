import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './database';
import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers/index';

//! Subscriptions
const pubsub = new PubSub();

//! Create the server
//+ The server expects an object as argument with:
//+     - typeDefs
//+     - resolvers
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return { db, pubsub, prisma, request };
    },
    fragmentReplacements
});

//! Start the server
server.start(() => {
    console.log('The Server is Running');
});
