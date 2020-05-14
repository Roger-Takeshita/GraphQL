import { extractFragmentReplacements } from 'prisma-binding';
import Query from './Query';
import Mutation from './Mutation';
import User from './User';
import Post from './Post';
import Comment from './Comment';
import Subscription from './Subscription';

const resolvers = {
    Query,
    Mutation,
    User,
    Post,
    Comment,
    Subscription
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
