import { Prisma } from 'prisma-binding';

//! Create the connection
//+ Then we pass an object as argument to connect prisma endpoint
//- We have to provide two things:
//? typeDefs, we need to provide type definitions for the endpoint, so prisma binding
//?     library can generate all the methods that we need
//? endpoint, specifies the URL where prisma graphical API lives
const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
});

//! PRISMA BINDINGS
//! prisma.query, prisma.mutation, prisma.subscription, prism.exists
//+ 1st argument options (operation args, selection set) - returns a promise
//- JSON.stringify ( data, replacer, indentation )
// prisma.query
//     .users(null, '{ id name posts { id title } }')
//     .then((data) => console.log(JSON.stringify(data, undefined, 4)));

// prisma.query
//     .comments(null, '{ id text author { id name } }')
//     .then((data) => console.log(JSON.stringify(data, undefined, 4)));

//! PRISMA MUTATIONS
//+ Create Post
//- 1st argument options (operation args, selection set) - returns a promise
//- Normal promise
/* prisma.mutation
    .createPost(
        {
            data: {
                title: 'My new graphql is live',
                body: 'New body',
                published: true,
                author: {
                    connect: {
                        id: 'cka410fwg000q07210ej6rcvf'
                    }
                }
            }
        },
        '{ id title body published }'
    )
    .then((data) => {
        console.log(JSON.stringify(data, undefined, 4));
        return prisma.query.users(null, '{ id name posts { id title } }');
    })
    .then((data) => console.log(JSON.stringify(data, undefined, 4))); */

//- Async/Await Create Post - Always return a promise
const createPostForUser = async (authorId, data) => {
    const userExists = await prisma.exists.User({
        id: authorId
    });
    if (!userExists) throw new Error('User not found');
    const post = await prisma.mutation.createPost(
        {
            data: {
                ...data,
                author: {
                    connect: {
                        id: authorId
                    }
                }
            }
        },
        '{ author { id name email posts { id title published } } }'
    );
    return post;
};

// createPostForUser('cka41btjj007w07211j27dlmt', {
//     title: 'Great books to read',
//     body: 'The art of war',
//     published: true
// })
//     .then((user) => console.log(JSON.stringify(user, undefined, 4)))
//     .catch((error) => console.log(error.message));

//+ Update Post
//- Normal promise
/* prisma.mutation
    .updatePost(
        {
            data: {
                title: 'UPDATED POST ' + new Date(),
                body: 'UPDATED BODY ' + new Date(),
                published: false
            },
            where: {
                id: 'cka4aoxst03gt07216u9txlf3'
            }
        },
        '{ id title body published }'
    )
    .then((data) => {
        console.log(JSON.stringify(data, undefined, 4));
        return prisma.query.posts(null, '{ id title body published author { id name } }');
    })
    .then((data) => console.log(JSON.stringify(data, undefined, 4))); */

//- Async/Await Update Post - Always return a promise
const updatePostFroUser = async (postId, data) => {
    const postExists = await prisma.exists.Post({ id: postId });
    if (!postExists) throw new Error('Post not found');
    const post = await prisma.mutation.updatePost(
        {
            data,
            where: {
                id: postId
            }
        },
        '{ author { id name email posts { id title published } } }'
    );
    return post;
};

updatePostFroUser('cka4ak88o03gk0721jh3lu4w5', {
    title: 'UPDATED POST ' + new Date(),
    body: 'UPDATED BODY ' + new Date(),
    published: false
})
    .then((user) => console.log(JSON.stringify(user, undefined, 4)))
    .catch((error) => console.log(error.message));

//! Prisma Exists
/* prisma.exists
    .Comment({
        id: 'cka43fetm01hu0721gf0pfa4w',
        author: {
            id: 'cka41btjj007w07211j27dlmt'
        }
    })
    .then((data) => console.log(data)); */
