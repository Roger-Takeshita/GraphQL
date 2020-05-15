<h1 id='summary'>Summary</h1>

-   [Prisma](#prisma)
    -   [Installation](#install)
    -   [Connecting Prisma With Node.js](#connectingprisma)
        -   [Prisma Installation](#prismainstall)
        -   [Connecting Prisma](#prismaconnection)
        -   [Schema](#grapqlschema)
            -   [On Delete](#delete)
            -   [Local Database](#localdatabase)
    -   [Config Server With Prisma](#configserver)
        -   [Create Prisma File](#createprismafile)
        -   [Connect Prisma To Server](#connectprismaserver)
            -   [Split Prisma Resolvers Into Multiple Files](#splitindex)
        -   [Wrapping Everything](#wrapping)
        -   [Connecting Prisma](#connectingprisma)
        -   [Subscription File](#subscription)
    -   [Multiple Prisma Projects](#multipleprisma)
    -   [Fragments - Lock individual type fields](#fragmentslock)
        -   [Fragments](#fragments)
    -   [Authentication](#authentication)
        -   [Install NPM Packages](#npmpackage)
        -   [Utilities Folder](#utilities)
        -   [Mutation File](#mutationsfile)
        -   [Query File](#queryfile)

<h1 id='prisma'>Prisma</h1>

[Go Back to Summary](#summary)

<h2 id='install'>Installation</h2>

[Go Back to Summary](#summary)

-   install prisma globally

    ```Bash
      npm i prisma -g
      npm i graphql-cli
    ```

-   Download the following tools
-   [pgAdmin](https://www.pgadmin.org/)

-   Create a PostgreSQL databate on Heroku

    -   Login to your [heroku account](https://dashboard.heroku.com/apps)
        -   Click on `New > Create new app`
            -   Give a name to your app (in my case `roger-takeshita-dev-server`)
            -   Click on `Create app`
        -   Click on your brand new project (`roger-takeshita-dev-server`)
            -   Click on `Resources`
                -   Find an `Add-ons` called `Heroku Postgres`
                    -   Select a plan (in this case `Hobby Dev - Free`)
                    -   Click on `Provision`
            -   Click on new add-on `Heroku Postgres` (it will open a new tab)
                -   Click on `Settings`
                    -   Click on `View Credentials`
                    -   Heroku will display all the information necessary for us to connect to the database
                    -   Use those information to login with your `pgAdmin`

    ```Bash
        Please note that these credentials are not permanent.

        Heroku rotates credentials periodically and updates applications where this database is attached.

        Host        ec2-52-70-15-120.compute-1.amazonaws.com
        Database    d7jasf7ogfo91
        User        tqiffasclofnar
        Port        5432
        Password    0fc0851041e3fe1a7c20efagasdfas92f05fasfas2a4ed66ea8738ac1b0e4c75b
        URI         postgres://tqiffasclofnar:0fc0851041e3fe1a7c20efagasdfas92f05fasfas2a4ed66ea8738ac1b0e4c75b@ec2-52-70-15-120.compute-1.amazonaws.com:5432/d7jasf7ogfo91
        Heroku CLI  heroku pg:psql postgresql-clean-98586 --app roger-takeshita-dev-server
    ```

<h2 id='connectingprisma'>Connecting Prisma With Node.js</h2>

<h3 id='prismainstall'>Prisma Installation</h3>

[Go Back to Summary](#summary)

```Bash
  npm i prisma-binding
```

-   [Prisma-Binding Repo](https://github.com/prisma-labs/prisma-binding)
-   [Prisma-Binding NPM](https://www.npmjs.com/package/prisma-binding)

-   It gives us a set of node.js methods that we can use to interact with our prisma graphical

    -   Examples

    ```Bash
        prisma.query.user(...)
        prisma.mutation.createUser(...)
        prisma.mutation.updateUser(...)
        prisma.mutation.deleteUser(...)
    ```

<h3 id='prismaconnection'>Connecting Prisma</h3>

[Go Back to Summary](#summary)

-   create a new file called `prisma.js` on the root of the project
-   `graphql-cli` gives us a couple of different commands for performing common tasks. And one of the common task is fetching the schema form a given API.
-   we need to create a graphql configuration file
    -   on the root of our project, create a `.graphqlconfig` (it's json configuration file)
        -   There we need to inform two things
            -   Where the schema lives
            -   Where where it should be saved

mkdir src/generated
touch .graphqlconfig src/prisma.js

-   in `.graphqlconfig`

    ```JSON
      {
          "projects": {
              "prisma": {
                  "schemaPath": "src/generated/prisma.graphql",
                  "extensions": {
                      "endpoints": {
                          "default": "http://localhost:4466"
                      }
                  }
              }
          }
      }
    ```

-   in `package.json`

    -   Add a new line `"get-schema"` we call graphql we invoke the method `get-schema` pass the `-p` (project) and **prisma** (project name)

    ```JSON
        "scripts": {
        "start": "nodemon src/index.js --ext js,graphql --exec babel-node",
        "test": "echo \"Error: no test specified\" && exit 1",
        "get-schema": "graphql get-schema -p prisma"
        },
    ```

-   then to generate the `prisma.graphql` inside the folder that we created
    -   Run `npm run get-schema`

<h3 id='grapqlschema'>Schema</h3>

[Go Back to Summary](#summary)

-   After running the command `npm run get-schema` prisma will automatically create 3 files inside `src/generated` folder
    -   `datamodel.prisma` - Our Schema
    -   `docker-compose.yml` - Our database configuration
        -   remove the line `Schema`
    -   `prisma.yml` - Our endpoint

<h4 id='delete'>On Delete</h4>

-   We have two available methods on delete

    -   By default is set to `SET_NULL` this means, if we delete an user, but this user has posts related to this user ID, prisma will set as `null` the id
    -   The other option is `CASCADE`, it we delete an user, this will delete all the chain related to this user

    ```JavaScript
      type User {
        id: ID! @id @unique
        name: String!
        email: String! @unique
        posts: [Post!]! @relation(name: "PostToUser", onDelete: CASCADE)
        comments: [Comment!]! @relation(name: "CommentToUser", onDelete: CASCADE)
        updatedAt: DateTime @updatedAt
        createdAt: DateTime @createdAt
      }

      type Post {
        id: ID! @id @unique
        title: String!
        body: String!
        published: Boolean!
        author: User! @relation(name: "PostToUser", onDelete: SET_NULL)
        comments: [Comment!]! @relation(name: "CommentToPost", onDelete: CASCADE)
      }

      type Comment {
        id: ID! @id @unique
        text: String!
        post: Post! @relation(name: "CommentToPost", onDelete: SET_NULL)
        author: User! @relation(name: "CommentToUser", onDelete: SET_NULL)
      }
    ```

<h4 id='localdatabase'>Local Database</h4>

[Go Back to Summary](#summary)

-   Create a file called `database` in our source directory
    -   `touch src/database.js`
-   Inside this file we are going to add dummy data

    ```JavaScript
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
                post: '12'
            }
        ];

        const db = {
            users,
            posts,
            comments
        };

        export { db as default };
    ```

<h2 id='configserver'>Config Server With Prisma</h2>

<h3 id='createprismafile'>Create Prisma File (Basic)</h3>

[Go Back to Summary](#summary)

-   Create a `prisma.js` inside `src` folder
-   In `src/prisma.js`

    -   We have all the methods to CRUD our data base using **Prisma Bindings**

    ```JavaScript
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

        //+ Update Post
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
    ```

    -   prisma.query.users(null, second_argument )
    -   second_argument can be:
        -   nothing / null / undefined - Never ask for relational data
        -   string - selection set as string
        -   object - info object (contains all the original information)

<h3 id='connectprismaserver'>Connect Prisma To Server</h3>

-   We need to refactor our prisma.js into multiple files to keep organized
-   Convert our `Promises` into `Async/Await`

[Go Back to Summary](#summary)

<h4 id='splitindex'>Split Prisma Resolvers Into Multiple Files</h4>

-   Create folder and files

    -   `mkdir src/resolvers`
    -   `touch src/resolvers/Comments.js src/resolvers/Mutation.js src/resolvers/Post.js src/resolvers/Query.js src/resolvers/Subscription.js src/resolvers/User.js`

-   in `Comment.js`

    ```JavaScript
        const Comment = {
            author(parent, args, { db: { users } }, info) {
                return users.find((user) => user.id === parent.author);
            },
            post(parent, args, { db: { posts } }, info) {
                return posts.find((post) => post.id === parent.post);
            }
        };

        export { Comment as default };
    ```

-   in `Post.js`

    ```JavaScript
        const Post = {
            author(parent, args, { db: { users } }, info) {
                return users.find((user) => user.id === parent.author);
            },
            comments(parent, args, { db: { comments } }, info) {
                return comments.filter((comment) => comment.post === parent.id);
            }
        };

        export { Post as default };
    ```

-   in `Mutation.js`

    ```JavaScript
        import uuidv4 from 'uuid/v4';

        const Mutations = {
            createUser(parent, { data }, { db: { users } }, info) {
                const emailTaken = users.some((user) => user.email === data.email);
                if (emailTaken) throw new Error('Email taken');

                const user = {
                    id: uuidv4(),
                    ...data
                };
                users.push(user);
                return user;
            },
            deleteUser(parent, { id }, { db: { users, posts } }, info) {
                const userIndex = users.findIndex((user) => user.id === id);
                if (userIndex === -1) throw new Error('User not found');
                const deletedUsers = users.splice(userIndex, 1);
                posts = posts.filter((post) => {
                    const match = post.author === id;
                    if (match) comments = comments.filter((comment) => comment.post !== post.id);
                    return !match;
                });
                comments = comments.filter((comment) => comment.author !== id);
                return deletedUsers[0];
            },
            updateUser(parent, { id, data }, { db: { users } }, info) {
                const user = users.find((user) => user.id === id);
                if (!user) throw new Error('User not found');
                if (typeof data.email === 'string') {
                    const emailTaken = users.some((user) => user.email === data.email);
                    if (emailTaken) throw new Error('Email in use');
                    user.email = data.email;
                }
                if (typeof data.name === 'string') user.name = data.name;
                if (typeof data.age !== 'undefined') user.age = data.age;
                return user;
            },
            createPost(parent, { data }, { db: { users, posts }, pubsub }, info) {
                const userExists = users.some((user) => user.id === data.author);
                if (!userExists) throw new Error('User not found');
                const post = {
                    id: uuidv4(),
                    ...data
                };
                posts.push(post);
                if (data.published)
                    pubsub.publish(`POST`, {
                        post: {
                            mutation: 'CREATED',
                            data: post
                        }
                    });
                return post;
            },
            deletePost(parent, { id }, { db: { posts, comments }, pubsub }, info) {
                const postIndex = posts.findIndex((post) => post.id === id);
                if (postIndex === -1) throw new Error('Post not found');
                const [post] = posts.splice(postIndex, 1);
                comments = comments.filter((comment) => comment.post !== id);
                if (post.published) {
                    pubsub.publish('POST', {
                        post: {
                            mutation: 'DELETED',
                            data: post
                        }
                    });
                }
                return post;
            },
            updatePost(parent, { id, data }, { db: { posts }, pubsub }) {
                const post = posts.find((post) => post.id === id);
                const originalPost = { ...post };
                if (!post) throw new Error('Post not found');
                if (typeof data.title === 'string') post.title = data.title;
                if (typeof data.body === 'string') post.body = data.body;
                if (typeof data.published === 'boolean') {
                    post.published = data.published;

                    if (originalPost.published && !post.published) {
                        pubsub.publish('POST', {
                            post: {
                                mutation: 'DELETED',
                                data: originalPost
                            }
                        });
                    } else if (!originalPost.published && post.published) {
                        pubsub.publish('POST', {
                            post: {
                                mutation: 'CREATED',
                                data: post
                            }
                        });
                    }
                } else if (post.published) {
                    pubsub.publish('POST', {
                        post: {
                            mutation: 'UPDATED',
                            data: post
                        }
                    });
                }
                return post;
            },
            createComment(parent, { data }, { db: { users, posts, comments }, pubsub }, info) {
                const userExists = users.some((user) => user.id === data.author);
                const postExists = posts.some((post) => post.id === data.post);
                if (!postExists || !userExists) throw new Error('Unable to find user or post');
                const comment = {
                    id: uuidv4(),
                    ...data
                };
                comments.push(comment);
                pubsub.publish(`COMMENT ${data.post}`, {
                    comment: {
                        mutation: 'CREATED',
                        data: comment
                    }
                });
                return comment;
            },
            deleteComment(parent, { id }, { db: { comments }, pubsub }, info) {
                const commentIndex = comments.findIndex((comment) => comment.id === id);
                if (commentIndex === -1) throw new Error('Comment not found');
                const [deletedComment] = comments.splice(commentIndex, 1);
                pubsub.publish(`COMMENT ${deletedComment.post}`, {
                    comment: {
                        mutation: 'DELETED',
                        data: deletedComment
                    }
                });
                return deletedComment;
            },
            updateComment(parent, { id, data }, { db: { comments }, pubsub }) {
                const commentExist = comments.find((comment) => comment.id === id);
                if (!commentExist) throw new Error('Comment not found');
                if (typeof data.text === 'string') commentExist.text = data.text;
                pubsub.publish(`COMMENT ${commentExist.post}`, {
                    comment: {
                        mutation: 'UPDATED',
                        data: commentExist
                    }
                });
                return commentExist;
            }
        };

        export { Mutations as default };
    ```

-   in `Query.js`

    ```JavaScript
        const Query = {
            users(parent, args, { db: { users } }, info) {
                if (!args.query) return users;
                return users.filter((user) => {
                    return user.name.toLowerCase().includes(args.query.toLowerCase());
                });
            },
            posts(parent, args, { db: { posts } }, info) {
                if (!args.query) return posts;
                return posts.filter((post) => {
                    const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                    const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                    return isTitleMatch || isBodyMatch;
                });
            },
            comments(parent, args, { db: { comments } }, info) {
                return comments;
            },
            me() {
                return {
                    id: '123',
                    name: 'Thaisa',
                    email: 'thaisa@gmail.com'
                };
            },
            post() {
                return {
                    id: '123',
                    title: 'GraphQL 101',
                    body: '',
                    published: false
                };
            }
        };

        export { Query as default };
    ```

-   in `Subscription.js`

    ```JavaScript
        const Subscription = {
            comment: {
                subscribe(parent, { postId }, { db: { posts }, pubsub }, info) {
                    const post = posts.find((post) => post.id == postId && post.published);
                    if (!post) throw new Error('Post not found');
                    return pubsub.asyncIterator(`COMMENT ${postId}`);
                }
            },
            post: {
                subscribe(parent, args, { pubsub }, info) {
                    return pubsub.asyncIterator(`POST`);
                }
            }
        };

        export { Subscription as default };
    ```

-   in `User.js`

    ```JavaScript
        const User = {
            posts(parent, args, { db: { posts } }, info) {
                return posts.filter((post) => post.author === parent.id);
            },
            comments(parent, args, { db: { comments } }, info) {
                return comments.filter((comment) => comment.author === parent.id);
            }
        };

        export { User as default };
    ```

<h3 id='wrapping'>Wrapping Everything</h3>

[Go Back to Summary](#summary)

-   In `src/index.js`

    -   We are going to import and connect everything
        -   import resolvers, database, prisma

    ```JavaScript
        import { GraphQLServer, PubSub } from 'graphql-yoga';
        import db from './database';
        import Query from './resolvers/Query';
        import Mutation from './resolvers/Mutation';
        import User from './resolvers/User';
        import Post from './resolvers/Post';
        import Comment from './resolvers/Comment';
        import Subscription from './resolvers/Subscription';
        import './prisma';

        //! Subscriptions
        const pubsub = new PubSub();

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
                Comment,
                Subscription
            },
            context: { db, pubsub }
        });

        //! Start the server
        server.start(() => {
            console.log('The Server is Running');
        });
    ```

<h3 id='connectingprisma'>Connecting Prisma</h3>

[Go Back to Summary](#summary)

-   in `src/resolvers/index.js`

    -   Import `GraphQLServer` from `graphql-yoga`
        -   To create our GraphQL server
    -   Import `PubSub` from `graphql-yoga`
        -   To create subscriptions
        -   In the future prisma will handle the subscription for us
    -   Import our local database (in the future we are going to connect with Prisma and Heroku/PostgreSQL)
    -   Import all our resolvers files
        -   Query, Mutation, User, Post, Comment, Subscription
    -   Import out prisma connection file
    -   then to connect Prisma with node.js, we just have to import in the beginning the file

    ```JavaScript
        import { GraphQLServer, PubSub } from 'graphql-yoga';
        import db from './database';
        import Query from './resolvers/Query';
        import Mutation from './resolvers/Mutation';
        import User from './resolvers/User';
        import Post from './resolvers/Post';
        import Comment from './resolvers/Comment';
        import Subscription from './resolvers/Subscription';
        import './prisma';

        //! Subscriptions
        const pubsub = new PubSub();

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
                Comment,
                Subscription
            },
            context: { db, pubsub }
        });

        //! Start the server
        server.start(() => {
            console.log('The Server is Running');
        });
    ```

<h3 id='subscription'>Subscription File</h3>

[Go Back to Summary](#summary)

-   Create a new file inside `src/resolvers` called `Subscription.js`
-   This file will be responsible for sending updated data to the users that subscribed for a specific post or comment
-   In the future we are going to use `prisma` to do all the heavy lifting for use, but for now let's manually do it

    ```JavaScript
        const Subscription = {
            comment: {
                subscribe(parent, { postId }, { db: { posts }, pubsub }, info) {
                    const post = posts.find((post) => post.id == postId && post.published);
                    if (!post) throw new Error('Post not found');
                    return pubsub.asyncIterator(`COMMENT ${postId}`);
                }
            },
            post: {
                subscribe(parent, args, { pubsub }, info) {
                    return pubsub.asyncIterator(`POST`);
                }
            }
        };

        export { Subscription as default };
    ```

<h2 id='multipleprisma'>Multiple Prisma Projects</h2>

[Go Back to Summary](#summary)

-   Created a new prisma project inside an existing project - Duplicate the prisma folder - Delete the `docker-compose.yml` we only need one a single Docker container running Prisma to deploy multiple prisma projects

    -   Then we need to change our `prisma.yml`, we have to add a new endpoint project - Where **reviews** is the service name (AKA project name)
    -   and **default** is the stage

    ```JavaScript
        endpoint: http://localhost:4466/reviews/default
        datamodel: datamodel.prisma
    ```

<h2 id='fragmentslock'>Fragments - Lock individual type fields</h2>

<h3 id='fragments'>Fragments</h3>

[Go Back to Summary](#summary)

-   To enable fragments in our project, we neeed:

    -   create a new file inside `src/resolvers` folder
        -   `touch src/resolvers/index.js`

-   In `src/resolvers/index.js`

    -   Import `extractFragmentReplacements` from `prisma-binding`
    -   Then cut all the resolvers from `src/index.js`
    -   Export `resolvers` and `fragmentReplacements`

    ```JavaScript
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
    ```

-   In `src/prisma.js`

    -   Import `fragmentReplacements` from `src/resolvers/index.js`
    -   Add to prisma connection
    -   Export `prisma` as default

    ```JavaScript
        import { Prisma } from 'prisma-binding';
        import { fragmentReplacements } from './resolvers/index';

        const prisma = new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'http://localhost:4466',
            secret: 'My$up3r$3cr3t',
            fragmentReplacements
        });

        export { prisma as default };
    ```

-   in `src/resolvers/Subscription.js`

    -   Refactor the subscription file to user prisma

        ```JavaScript
            const Subscription = {
                comment: {
                    subscribe(parent, { postId }, { prisma }, info) {
                        return prisma.subscription.comment(
                            {
                                where: {
                                    node: { post: { id: postId } }
                                }
                            },
                            info
                        );
                    }
                },
                post: {
                    subscribe(parent, args, { prisma }, info) {
                        return prisma.subscription.post(
                            {
                                where: {
                                    node: { published: true }
                                }
                            },
                            info
                        );
                    }
                },
            };

            export { Subscription as default };
        ```

-   In `src/index.js`

    -   Import `resolvers` and `fragmentReplacements` from `./resolvers/index.js`
    -   Convert the context as a function, to pass down the `request`
    -   Add `fragmentReplacements`
    -   Import `prisma` from `./prisma`

    | Key     | Type               | Default | Note                                                                                                                                                                        |
    | ------- | ------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | context | Object or Function | {}      | Contains custom data being passed through your resolver chain. This can be passed in as an object, or as a Function with the signature (req: ContextParameters) => any \*\* |

    ```JavaScript
        import { GraphQLServer, PubSub } from 'graphql-yoga';
        import db from './database';
        import prisma from './prisma';
        import { resolvers, fragmentReplacements } from './resolvers/index';

        const pubsub = new PubSub();

        const server = new GraphQLServer({
            typeDefs: './src/schema.graphql',
            resolvers,
            context(request) {
                return { db, pubsub, prisma, request };
            },
            fragmentReplacements
        });

        server.start(() => {
            console.log('The Server is Running');
        });
    ```

<h2 id='authentication'>Authentication</h2>

[Go Back to Summary](#summary)

-   All the authentication happens behind the scenes with prisma
-   The flow of the data is

    -   Prisma -> Node -> Client (Our instance of GraphQL playground)
    -   But when we send data from prisma to node the data has the following structure (comment)

        -   Prisma is sending to node
            -   mutation
            -   node
            -   updatedField
            -   previousField
        -   But node is sending back to Client
            -   mutation
            -   data
        -   This means that we are loosing data along the way, and there is no field called data.
        -   We'll have to change to `node` so it can match with prisma type definition

-   In `schema.graphql` we have to change the `CommentSubscriptionPayload` to match this modification

    ```JavaScript
        type CommentSubscriptionPayload {
            mutation: MutationType!
            node: Comment
        }
    ```

-   Prisma secret (password)

    -   To force the user use our localhost:4000 and not localhost:4466 (direct channel to our database)

        -   We have to do that on our prisma
        -   In `prisma/prisma.yml`

        ```JavaScript
            endpoint: http://localhost:4466
            datamodel: datamodel.prisma
            secret: My$up3r$3cr3t
        ```

-   In `prisma.js`

    -   Add the password as string

    ```JavaScript
        const prisma = new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'http://localhost:4466',
            secret: 'My$up3r$3cr3t'
        });
    ```

-   Generate `Authorization` token

    -   `cd prisma`
    -   `prisma token`
        -   This command will generate a prisma token, so we can copy and past into our prisma playground

-   Wiping database to add a new field `password`

    -   In `prisma/datamodel.prisma` add a `password` field and set as a non nullable field (`String!`)

    ```JavaScript
        type User {
            id: ID! @id @unique
            name: String!
            password: String!
            email: String! @unique
            posts: [Post!]! @relation(name: "PostToUser", onDelete: CASCADE)
            comments: [Comment!]! @relation(name: "CommentToUser", onDelete: CASCADE)
            updatedAt: DateTime @updatedAt
            createdAt: DateTime @createdAt
        }
    ```

    -   Then we need to update our schema

    ```JavaScript
        type User {
            id: ID!
            name: String!
            password: String!
            email: String!
            posts: [Post!]!
            comments: [Comment!]!
        }
    ```

    -   Then run `prisma delete`
        -   `Y`
    -   Then run `prisma deploy`
    -   then run `cd ..`
    -   then run `npm run get-schema`
        -   We will get an error because we don't a token/secrete to access
        -   An alternative is to point our local `prisma.yml`
        -   In `.graphqlconfig`

    ```JavaScript
        {
            "projects": {
                "prisma": {
                    "schemaPath": "src/generated/prisma.graphql",
                    "extensions": {
                        "prisma" : "prisma/prisma.yml",
                        "endpoints": {
                            "default": "http://localhost:4466"
                        }
                    }
                }
            }
        }
    ```

<h3 id='npmpackage'>Install NPM Packages</h3>

[Go Back to Summary](#summary)

-   `npm i bcryptjs`
-   `npm i jsonwebtoken`

<h3 id='utilities'>Utilities Folder</h3>

[Go Back to Summary](#summary)

-   Create a new folder and file

    -   `mkir src/utils touch src/utils/getUserId.js`
    -   Import `JWT`
    -   this file will be responsible to decode/validate the token before doing anything else

    ```JavaScript
        import jwt from 'jsonwebtoken';
        const JWT_SECRET = 'MyJWT$3cr3t';

        const getUserId = (request, requireAuth = true) => {
            const header = request.request.headers.authorization;
            if (header) {
                const token = header.replace('Baerer ', '');
                const decoded = jwt.verify(token, JWT_SECRET);
                if (!decoded) throw new Error('Bad token');
                return decoded.userId;
            }
            if (requireAuth) throw new Error('Authentication is required');
            return null;
        };

        export { getUserId as default };
    ```

<h3 id='mutationsfile'>Mutation File</h3>

[Go Back to Summary](#summary)

-   Refactor the mutations file (`src/resolvers/Mutation.js`) to user authentication
-   Import `jwt` from `jsonwebtoken`
    -   Create a `JWT_SECRET` (In the future we're goind go use .env)
    -   `jwt` will be responsible for generating a new token
-   import `bcrypt` from `bcryptjs`

    -   Create a `BCRYPT_SALT` variable to salt/hash the password

    ```JavaScript
        import jwt from 'jsonwebtoken';
        const JWT_SECRET = 'MyJWT$3cr3t';
        import bcrypt from 'bcryptjs';
        const BCRYPT_SALT = 6;
        import getUserId from '../utils/getUserId';

        const Mutations = {
            async createUser(parent, { data }, { prisma }, info) {
                if (data.password.length < 8) throw new Error('Password must be 8 characters or longer');
                const password = await bcrypt.hash(data.password, BCRYPT_SALT);
                const user = await prisma.mutation.createUser({
                    data: {
                        ...data,
                        password
                    }
                });
                console.log(user);
                return {
                    user,
                    token: jwt.sign({ userId: user.id }, JWT_SECRET)
                };
            },
            async loginUser(parent, { data }, { prisma }, info) {
                const user = await prisma.query.user({
                    where: {
                        email: data.email
                    }
                });
                if (!user) throw new Error('Bad credentials');
                const isMatch = await bcrypt.compare(data.password, user.password);
                if (!isMatch) throw new Error('Bad credentials');
                return {
                    user,
                    token: jwt.sign({ userId: user.id }, JWT_SECRET)
                };
            },
            deleteUser(parent, args, { prisma, request }, info) {
                const userId = getUserId(request);
                return prisma.mutation.deleteUser({ where: { id: userId } }, info);
            },
            updateUser(parent, { data }, { prisma, request }, info) {
                const userId = getUserId(request);
                return prisma.mutation.updateUser({ data: data, where: { id: userId } }, info);
            },
            createPost(parent, { data }, { prisma, request }, info) {
                const userId = getUserId(request);
                return prisma.mutation.createPost(
                    {
                        data: {
                            title: data.title,
                            body: data.body,
                            published: data.published,
                            author: {
                                connect: {
                                    id: userId
                                }
                            }
                        }
                    },
                    info
                );
            },
            async deletePost(parent, { id }, { prisma, request }, info) {
                const userId = getUserId(request);
                const postExists = await prisma.exists.Post({
                    id,
                    author: {
                        id: userId
                    }
                });
                if (!postExists) throw new Error('Post not found');
                return prisma.mutation.deletePost({ where: { id } }, info);
            },
            async updatePost(parent, { id, data }, { prisma, request }) {
                const userId = getUserId(request);
                const postExists = await prisma.exists.Post({
                    id,
                    author: {
                        id: userId
                    }
                });
                if (!postExists) throw new Error('Post not found');
                return prisma.mutation.updatePost({
                    data: { ...data },
                    where: { id }
                });
            },
            createComment(parent, { data }, { prisma, request }, info) {
                const userId = getUserId(request);
                return prisma.mutation.createComment(
                    {
                        data: {
                            text: data.text,
                            author: { connect: { id: userId } },
                            post: { connect: { id: data.post } }
                        }
                    },
                    info
                );
            },
            async deleteComment(parent, { id }, { prisma, request }, info) {
                const userId = getUserId(request);
                const commentExists = await prisma.exists.Comment({
                    id,
                    author: {
                        id: userId
                    }
                });
                if (!commentExists) throw new Error('Comment not found');
                return prisma.mutation.deleteComment({ where: { id } }, info);
            },
            async updateComment(parent, { id, data }, { prisma, request }, info) {
                const userId = getUserId(request);
                const commentExists = await prisma.exists.Comment({
                    id,
                    author: {
                        id: userId
                    }
                });
                if (!commentExists) throw new Error('Comment not found');
                return prisma.mutation.updateComment({ data, where: { id } }, info);
            }
        };

        export { Mutations as default };
    ```

<h3 id='queryfile'>Query File</h3>

[Go Back to Summary](#summary)

-   Refactor the query file (`src/resolvers/Query.js`) to user authentication
-   Import `getUserId` from `src/utils/getUserId.js`

    ```JavaScript
        import getUserId from '../utils/getUserId';

        const Query = {
            users(parent, { query }, { prisma }, info) {
                const opArgs = {};
                if (query) {
                    opArgs.where = {
                        OR: [{ name_contains: query }, { email_contains: query }]
                    };
                }
                return prisma.query.users(opArgs, info);
            },
            posts(parent, { query }, { prisma }, info) {
                const opArgs = {
                    where: {
                        published: true
                    }
                };
                if (query) {
                    opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];
                }

                return prisma.query.posts(opArgs, info);
            },
            myPosts(parent, { query }, { prisma, request }, info) {
                const userId = getUserId(request);
                const opArgs = {
                    where: {
                        author: { id: userId }
                    }
                };
                if (query) {
                    opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];
                }
                return prisma.query.posts(opArgs, info);
            },
            comments(parent, args, { prisma }, info) {
                return prisma.query.comments(null, info);
            },
            async me(parent, args, { prisma, request }, info) {
                const userId = getUserId(request);
                const userExists = await prisma.query.users(
                    {
                        where: { id: userId }
                    },
                    info
                );
                if (userExists.length === 0) throw new Error('User not found');
                return userExists[0];
            },
            async post(parent, { id }, { prisma, request }, info) {
                const userId = getUserId(request, false);
                const posts = await prisma.query.posts(
                    {
                        where: {
                            id,
                            OR: [{ published: true }, { author: { id: userId } }]
                        }
                    },
                    info
                );
                if (posts.length === 0) throw new Error('Post not found');
                return posts[0];
            }
        };

        export { Query as default };
    ```
