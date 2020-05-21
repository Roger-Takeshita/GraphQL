<h1 id='summary'>Summary</h1>

- [Basic Babel VSCode](#babelvscode)
  - [Installation](#babelinstall)
    - [NPM Packages](#installpackages)
    - [Folder and Files](#folderfiles)
    - [package.json](#packagejson)
  - [Configuration](#configuration)
  - [Run Code](#runcode)
  - [GraphQL Scalar Types](#graphqltypes)
- [Creating Your Own GraphQL API](#creatinggraphqlapi)
  - [GraphQL Server](#graphqlserver)
- [Prisma](#prisma)
  - [Installation](#install)
  - [Connecting Prisma With Node.js](#connectingprisma)
    - [Prisma Installation](#prismainstall)
    - [Connecting Prisma](#prismaconnection)
    - [Schema](#grapqlschema)
      - [On Delete](#delete)
      - [Local Database](#localdatabase)
  - [Config Server With Prisma](#configserver)
    - [Create Prisma File](#createprismafile)
    - [Connect Prisma To Server](#connectprismaserver)
      - [Split Prisma Resolvers Into Multiple Files](#splitindex)
    - [Wrapping Everything](#wrapping)
    - [Connecting Prisma](#connectingprisma)
    - [Subscription File](#subscription)
  - [Multiple Prisma Projects](#multipleprisma)
  - [Fragments - Lock individual type fields](#fragmentslock)
    - [Fragments](#fragments)
  - [Authentication](#authentication)
    - [Install NPM Packages](#npmpackage)
    - [Utilities Folder](#utilities)
    - [Mutation File](#mutationsfile)
    - [Query File](#queryfile)

* [Deploying To Heroku](#deploying)
  - [Connecting Prisma Cloud](#connectingprismacloud)
  - [Connecting pgAdmin to Database](#connectingpgadmin)
  - [Deploying to Heroku](#deployingtoheroku)
    - [Environment Variables](#environmentvariables)
      - [Prisma Endpoint](#prismaendpoint)
    - [Before Deploying](#beforedploying)
    - [Create Heroku App](#createapp)
      - [Login](#herokulogin)
      - [Create App](#herokucreate)
    - [Deploy to GitHub - Subtree](#deploytogitsubtree)
* [Testing - Jest Framework](#testinggraphql)
  - [Packages](#testpackage)
  - [.babelrc](#babelrc)
  - [Test Environment File](#testenv)
  - [Refactor Server for Testing](#refactor)
  - [Apollo Client (Server) - Send GraphQL Operations](#apolloclient)
    - [Apollo Client Server](#apolloclientserver)
    - [Packages](#apolloclientpacakge)
    - [Set Up Parcel](#setupparcel)
    - [Index.js](#setupindexjs)
    - [Index.html](#indexhtml)
  - [Create Test Folder and Files](#testfolder)
    - [User Test](#usertest)
    - [Post Test](#posttest)
    - [Comment Test](#commentest)
  - [Configuring Jest](#configuringjest)
    - [Packages](#jestpackage)
    - [package.json](#jestjson)
    - [Config Folder](#jestfolder1)
      - [globalSetup](#globalsetup)
      - [globalTeardown](#teardown)
    - [Utils Folder](#utilsfolder)
      - [getClient](#getclient)
      - [operations](#operations)
      - [seedDatabase](#seeddatabase)
    - [Subscriptions](#subscriptions)
      - [Packages](#subpackage)
      - [getClient Subscription](#getclientsub)

<h1 id='babelvscode'>Basic Babel VSCode</h1>

<h2 id='babelinstall'>Installation</h2>

<h3 id='installpackages'>NPM Packages</h3>

[Go Back to Summary](#summary)

```Bash
  npm init
  npm i babel-cli
  npm i babel-preset-env
  npm i graphql-yoga
```

<h3 id='folderfiles'>Folder and Files</h3>

[Go Back to Summary](#summary)

```Bash
  mkdir src src/demo
  touch src/index.js src/demo/myModule.js src/demo/math.js .babelrc
```

<h3 id='packagejson'>package.json</h3>

[Go Back to Summary](#summary)

- Add `babel-node src/index.js` in the scripts array

  ```Bash
    "scripts": {
        "start": "babel-node src/index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```

- Or use nodemon to run the server

  ```Bash
    "scripts": {
    "start": "nodemon src/index.js --exec babel-node",
    "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```

<h2 id='configuration'>Configuration</h2>

[Go Back to Summary](#summary)

- In `.babelrc`

  ```JavaScript
    {
        "presets": ["env"]
    }
  ```

- In `src/demo/myModule.js`

  - It will contain contain some code that's necessary for `index.js` to run
    - function, methods, variables...
  - Named export - Has a name. Have as many as needed
  - Default export - Has no name. You can only have one

    ```JavaScript
      const message = 'Some message from myModule.js';
      const name = 'Roger Takeshita';
      const location = 'Toronto';
      const getGreeting = (name) => `Welcome to the course ${name}`;

      export { message, name, getGreeting, location as default };
    ```

- In `src/demo/math.js`

  ```JavaScript
    const add = (number1, number2) => number1 + number2;
    const subtract = (number1, number2) => number1 - number2;

    export { subtract, add as default };
  ```

- In `src/index.js`

  ```JavaScript
    import myCurrentLocation, { message, name, getGreeting } from './demo/myModule';
    import sum, { subtract } from './demo/math';

    console.log(message);
    console.log(name);
    console.log(myCurrentLocation);
    console.log(getGreeting('Thaisa'));

    console.log(sum(1, 1));
    console.log(subtract(1, 1));
  ```

<h2 id='runcode'>Run Code</h2>

[Go Back to Summary](#summary)

- `npm run start`

<h2 id='graphqltypes'>GraphQL Scalar Types</h2>

[Go Back to Summary](#summary)

- GraphQL has 5 scalar types:
  - String
  - Boolean
  - Int
  - Float
  - ID

<h1 id='creatinggraphqlapi'>Creating Your Own GraphQL API</h1>

<h2 id='graphqlserver'>GraphQL Server</h2>

[Go Back to Summary](#summary)

- Import the `{GraphQLServer}` from `graphql-yoga`
- Then we have to define:

  - `Type definitions` - Schema (Data Structures)
  - `Resolvers` - Define functions that run for each of the operations that can be performed on our API

- in `src/index.js`

  ```JavaScript
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
  ```

<h1 id='prisma'>Prisma</h1>

[Go Back to Summary](#summary)

<h2 id='install'>Installation</h2>

[Go Back to Summary](#summary)

- install prisma globally

  ```Bash
    npm i prisma -g
    npm i graphql-cli
  ```

- Download the following tools
- [pgAdmin](https://www.pgadmin.org/)

- Create a PostgreSQL database on Heroku

  - Login to your [heroku account](https://dashboard.heroku.com/apps)
    - Click on `New > Create new app`
      - Give a name to your app (in my case `roger-takeshita-dev-server`)
      - Click on `Create app`
    - Click on your brand new project (`roger-takeshita-dev-server`)
      - Click on `Resources`
        - Find an `Add-ons` called `Heroku Postgres`
          - Select a plan (in this case `Hobby Dev - Free`)
          - Click on `Provision`
      - Click on new add-on `Heroku Postgres` (it will open a new tab)
        - Click on `Settings`
          - Click on `View Credentials`
          - Heroku will display all the information necessary for us to connect to the database
          - Use those information to login with your `pgAdmin`

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

- [Prisma-Binding Repo](https://github.com/prisma-labs/prisma-binding)
- [Prisma-Binding NPM](https://www.npmjs.com/package/prisma-binding)

- It gives us a set of node.js methods that we can use to interact with our prisma graphical

  - Example:

  ```Bash
    prisma.query.user(...)
    prisma.mutation.createUser(...)
    prisma.mutation.updateUser(...)
    prisma.mutation.deleteUser(...)
  ```

<h3 id='prismaconnection'>Connecting Prisma</h3>

[Go Back to Summary](#summary)

- create a new file called `prisma.js` on the root of the project
- `graphql-cli` gives us a couple of different commands for performing common tasks. And one of the common task is fetching the schema form a given API.
- we need to create a graphql configuration file

  - on the root of our project, create a `.graphqlconfig` (it's json configuration file)
    - There we need to inform two things
      - Where the schema lives
      - Where where it should be saved

  ```Bash
    mkdir src/generated
    touch .graphqlconfig src/prisma.js
  ```

- in `.graphqlconfig`

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

- in `package.json`

  - Add a new line `"get-schema"` we call graphql we invoke the method `get-schema` pass the `-p` (project) and **prisma** (project name)

  ```JSON
    "scripts": {
    "start": "nodemon src/index.js --ext js,graphql --exec babel-node",
    "test": "echo \"Error: no test specified\" && exit 1",
    "get-schema": "graphql get-schema -p prisma"
    },
  ```

- then to generate the `prisma.graphql` inside the folder that we created
  - Run `npm run get-schema`

<h3 id='grapqlschema'>Schema</h3>

[Go Back to Summary](#summary)

- After running the command `npm run get-schema` prisma will automatically create 3 files inside `src/generated` folder
  - `datamodel.prisma` - Our Schema
  - `docker-compose.yml` - Our database configuration
    - remove the line `Schema`
  - `prisma.yml` - Our endpoint

<h4 id='delete'>On Delete</h4>

- We have two available methods on delete

  - By default is set to `SET_NULL` this means, if we delete an user, but this user has posts related to this user ID, prisma will set as `null` the id
  - The other option is `CASCADE`, it we delete an user, this will delete all the chain related to this user

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

- Create a file called `database` in our source directory
  - `touch src/database.js`
- Inside this file we are going to add dummy data

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

- Create a `prisma.js` inside `src` folder
- In `src/prisma.js`

  - We have all the methods to CRUD our data base using **Prisma Bindings**

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

  - prisma.query.users(null, second_argument )
  - second_argument can be:
    - nothing / null / undefined - Never ask for relational data
    - string - selection set as string
    - object - info object (contains all the original information)

<h3 id='connectprismaserver'>Connect Prisma To Server</h3>

- We need to refactor our prisma.js into multiple files to keep organized
- Convert our `Promises` into `Async/Await`

[Go Back to Summary](#summary)

<h4 id='splitindex'>Split Prisma Resolvers Into Multiple Files</h4>

- Create folder and files

  ```Bash
    mkdir src/resolvers
    touch src/resolvers/Comments.js src/resolvers/Mutation.js src/resolvers/Post.js src/resolvers/Query.js src/resolvers/Subscription.js src/resolvers/User.js
  ```

- in `Comment.js`

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

- in `Post.js`

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

- in `Mutation.js`

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

- in `Query.js`

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

- in `Subscription.js`

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

- in `User.js`

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

- In `src/index.js`

  - We are going to import and connect everything
    - import resolvers, database, prisma

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

- in `src/resolvers/index.js`

  - Import `GraphQLServer` from `graphql-yoga`
    - To create our GraphQL server
  - Import `PubSub` from `graphql-yoga`
    - To create subscriptions
    - In the future prisma will handle the subscription for us
  - Import our local database (in the future we are going to connect with Prisma and Heroku/PostgreSQL)
  - Import all our resolvers files
    - Query, Mutation, User, Post, Comment, Subscription
  - Import out prisma connection file
  - then to connect Prisma with node.js, we just have to import in the beginning the file

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

- Create a new file inside `src/resolvers` called `Subscription.js`
- This file will be responsible for sending updated data to the users that subscribed for a specific post or comment
- In the future we are going to use `prisma` to do all the heavy lifting for use, but for now let's manually do it

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

- Created a new prisma project inside an existing project - Duplicate the prisma folder - Delete the `docker-compose.yml` we only need one a single Docker container running Prisma to deploy multiple prisma projects

  - Then we need to change our `prisma.yml`, we have to add a new endpoint project - Where **reviews** is the service name (AKA project name)
  - and **default** is the stage

  ```JavaScript
    endpoint: http://localhost:4466/reviews/default
    datamodel: datamodel.prisma
  ```

<h2 id='fragmentslock'>Fragments - Lock individual type fields</h2>

<h3 id='fragments'>Fragments</h3>

[Go Back to Summary](#summary)

- To enable fragments in our project, we neeed:

  - create a new file inside `src/resolvers` folder
    - `touch src/resolvers/index.js`

- In `src/resolvers/index.js`

  - Import `extractFragmentReplacements` from `prisma-binding`
  - Then cut all the resolvers from `src/index.js`
  - Export `resolvers` and `fragmentReplacements`

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

- In `src/prisma.js`

  - Import `fragmentReplacements` from `src/resolvers/index.js`
  - Add to prisma connection
  - Export `prisma` as default

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

- in `src/resolvers/Subscription.js`

  - Refactor the subscription file to user prisma

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

- In `src/index.js`

  - Import `resolvers` and `fragmentReplacements` from `./resolvers/index.js`
  - Convert the context as a function, to pass down the `request`
  - Add `fragmentReplacements`
  - Import `prisma` from `./prisma`

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

- All the authentication happens behind the scenes with prisma
- The flow of the data is

  - Prisma -> Node -> Client (Our instance of GraphQL playground)
  - But when we send data from prisma to node the data has the following structure (comment)

    - Prisma is sending to node
      - mutation
      - node
      - updatedField
      - previousField
    - But node is sending back to Client
      - mutation
      - data
    - This means that we are loosing data along the way, and there is no field called data.
    - We'll have to change to `node` so it can match with prisma type definition

- In `schema.graphql` we have to change the `CommentSubscriptionPayload` to match this modification

  ```JavaScript
    type CommentSubscriptionPayload {
        mutation: MutationType!
        node: Comment
    }
  ```

- Prisma secret (password)

  - To force the user use our localhost:4000 and not localhost:4466 (direct channel to our database)

    - We have to do that on our prisma
    - In `prisma/prisma.yml`

    ```JavaScript
      endpoint: http://localhost:4466
      datamodel: datamodel.prisma
      secret: My$up3r$3cr3t
    ```

- In `prisma.js`

  - Add the password as string

  ```JavaScript
    const prisma = new Prisma({
        typeDefs: 'src/generated/prisma.graphql',
        endpoint: 'http://localhost:4466',
        secret: 'My$up3r$3cr3t'
    });
  ```

- Generate `Authorization` token

  - `cd prisma`
  - `prisma token`
    - This command will generate a prisma token, so we can copy and past into our prisma playground

- Wiping database to add a new field `password`

  - In `prisma/datamodel.prisma` add a `password` field and set as a non nullable field (`String!`)

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

  - Then we need to update our schema

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

  - Then run `prisma delete`
    - `Y`
  - Then run `prisma deploy`
  - then run `cd ..`
  - then run `npm run get-schema`
    - We will get an error because we don't a token/secrete to access
    - An alternative is to point our local `prisma.yml`
    - In `.graphqlconfig`

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

```Bash
  npm i bcryptjs jsonwebtoken
```

<h3 id='utilities'>Utilities Folder</h3>

[Go Back to Summary](#summary)

- Create a new folder and file

  - `mkir src/utils touch src/utils/getUserId.js`
  - Import `JWT`
  - this file will be responsible to decode/validate the token before doing anything else

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

- Refactor the mutations file (`src/resolvers/Mutation.js`) to user authentication
- Import `jwt` from `jsonwebtoken`
  - Create a `JWT_SECRET` (In the future we're goind go use .env)
  - `jwt` will be responsible for generating a new token
- import `bcrypt` from `bcryptjs`

  - Create a `BCRYPT_SALT` variable to salt/hash the password

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

- Refactor the query file (`src/resolvers/Query.js`) to user authentication
- Import `getUserId` from `src/utils/getUserId.js`

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

<h1 id='deploying'>Deploying To Heroku</h1>

[Go Back to Summary](#summary)

- Heroku

  - Heroku will host our database, docker container and our node.js application

<h2 id='connectingprismacloud'>Connecting Prisma Cloud</h2>

[Go Back to Summary](#summary)

- Prisma cloud, manager of heroku prisma instances - So we don't need to do anything fancy to get the database (prisma cloud will do that for us)

  - prisma.io/cloud
    - Click on `Servers`
      - By default there are two servers running (created by prisma)
        - prisma-eu1
        - prisma-us1
        - We cannot access or change
      - Click on `Add Server`
        - Add a new Prisma server
          - Give a name to your server (`Server name`)
            - In my case will be `roger-takeshita`
          - Give a description to your server (`Server description`)
            - In my case will be `Blogging application`
          - Click on `CREATE A SERVER`
    - Set up a database
      - Click on `Create a new database`
    - Choose a database provider
      - Click on `Heroku Supports PostgreSQL`
    - Connect to Heroku
      - Click on `Connect to a new Heroku account`
      - Click on `Allow Prisma to Manage Your Heroku Account`
      - Back to prisma page, click on the account you've just allowed
    - Create a new database
      - Stick with the default
        - Database type: `PostgreSQL`
        - Database region: `US (Virginia)`
      - Click on `CREATE DATABASE`
    - New database successfully create!
      - Click on `SET UP SERVER`
    - Choose a server provider
      - Click on `Heroku`
    - Create a new server
      - Select `Free`
      - Click on `CREATE SERVER`
    - Connection Information
      - Click on `Servers`
      - Click on your server
        - In my case `roger-takeshita`
      - Click on `Database VIEW ON HEROKU`
        - It will redirect to Heroku page
        - Click on `Resources` tab
          - Click on `Heroku Postgres`
            - You will be redirected to heroku dashboard
        - On `data.heroku.com/dashboard`
          - Click on `Settings` tab
            - Click o `View Credentials`

<h2 id='connectingpgadmin'>Connecting pgAdmin to Database</h2>

[Go Back to Summary](#summary)

- Add a Server
  - Right click on `Servers` list
    - Then `Create > Server`
    - On `General` tab, give a name to your server
      - In my case `roger-takeshita-dev-server`
    - On `Connection` tab, we have to fill all the information that we get from Heroku

<h2 id='deployingtoheroku'>Deploying to Heroku</h2>

<h3 id='environmentvariables'>Environment Variables</h3>

[Go Back to Summary](#summary)

- Install the `env-cmd` package

  ```Bash
    npm i env-cmd
  ```

- Create folder and files

  - You can choose whatever name you want for the folder and file names

  ```Bash
      mkdir env
      touch env/dev.env env/prod.env
  ```

- In `env/dev.env`

  - Add our development environment variables

  ```Bash
    PRISMA_ENDPOINT=http://localhost:4466
    PRISMA_SECRET=My$up3r$3cr3t
    JWT_SECRET=MyJWT$3cr3t
  ```

- In `env/dev.env`
  - We will Add our production environment variables
  - For now leave it blank

<h4 id='prismaendpoint'>Prisma Endpoint</h4>

- On your terminal change the directory to `prisma` folder
- In `prisma/prisma.yml`

  ```Bash
    endpoint: ${env:PRISMA_ENDPOINT}
    datamodel: datamodel.prisma
    secret: ${env:PRISMA_SECRET}
  ```

- Then we need to login to Prisma Cloud

  - Run the command: `prima login`

- Getting our production PRIMS_ENDPOINT from prisma cloud

  - Run the command: `prisma deploy -e ../env/prod.env`

    - On the list pick the service that we created
      - `roger-takeshita-a2das/roger-takeshita-blog-app`
    - Choose a name for your service:
      - `roger-takeshita-blog-app`
    - Choose a name for your state:
      - `prod`
    - After the process has finished
      - In `prisma.yml`
      - We now have a commented out endpoint and a new endpoint that prisma generated for us
        - `https://roger-takeshita-c4141231231.herokuapp.com/roger-takeshita-blog-app/prod`

  - Cut the new endpoint link
  - Uncomment the original endpoint
  - Save the `prisma.yml`

- in `env/prod.env`

  - paste the our production endpoint

  ```Bash
    PRISMA_ENDPOINT=https://roger-takeshita-c4141231231.herokuapp.com/roger-takeshita-blog-app/prod
    PRISMA_SECRET=DIFFERENTFROMDEVMy$up3r$3cr3t
    JWT_SECRET=DIFFERENTFROMDEVMyJWT$3cr3t
  ```

<h3 id='beforedploying'>Before Deploying</h3>

[Go Back to Summary](#summary)

- Before deploying to heroku we have to change a few things to our server
- In `src/index.js`

  - Add an environment PORT, heroku wil use this environment variable to inject his own port

  ```JavaScript
    server.start({ port: process.env.PORT || 4000 }, () => {
        console.log('The Server is Running');
    });
  ```

- Change all files to use environment variables

  - `src/utils/getToken.js`
  - `src/utils/getUserId.js`

- In `package.json`

  - update our scripts
  - **start**
    - heroku will use this path to start our server
  - **heroku-postbuild**

    - Uses babel
    - Copy `src` folder into a new folder `dist`
    - `--copy-files`, copy all other files that are not javascript files

  - Install `@babel/polyfill`

    - `babel-node` uses the new features like `async/await`
    - but babel don't, that's why we need to install a `@babel/polyfill`
    - In `src/index.js`
      - import `@babel/polyfill` at the top of the file

    ```JavaScript
      "scripts": {
          "start": "node dist/index.js",
          "heroku-postbuild": "babel src --out-dir dist --copy-files",
          "dev": "env-cmd -f ./env/dev.env nodemon src/index.js --ext js,graphql --exec babel-node",
          "test": "echo \"Error: no test specified\" && exit 1",
          "get-schema": "graphql get-schema -p prisma --dotenv env/dev.env"
      },
    ```

<h3 id='createapp'>Create Heroku App</h3>

[Go Back to Summary](#summary)

<h4 id='herokulogin'>Login</h4>

[Go Back to Summary](#summary)

```Bash
  heroku login
```

<h4 id='herokucreate'>Create App</h4>

[Go Back to Summary](#summary)

```Bash
  heroku create <app_name>
```

<h3 id='deploytogitsubtree'>Deploy to GitHub - Subtree</h3>

[Go Back to Summary](#summary)

```Bash
  git subtree push --prefix path/to/subdirectory heroku master
```

- where `path/to/subdirectory` is the path to the project that you want to deploy to heroku
- for example we have this [repo](https://github.com/Roger-Takeshita/GraphQL)

  - Inside we have a folder called `2_GraphQL_Prisma` (we want to deploy this folder)

    ```Bash
      git subtree push --prefix 2_GraphQL_Prisma heroku master
    ```

<h1 id='testinggraphql'>Testing - Jest Framework</h1>

<h2 id='testpackage'>Packages</h2>

[Go Back to Summary](#summary)

```Bash
  npm install @babel/cli @babel/preset-env @babel/plugin-proposal-object-rest-spread @babel/core @babel/node @babel/polyfill @babel/register
  npm i jest --save-dev
  npm i --save-dev @babel/plugin-transform-runtime
```

<h2 id='babelrc'>.babelrc</h2>

[Go Back to Summary](#summary)

- in `.babelrc`

  - Update our babel config file

  ```JavaScript
    {
      "env": {
        "test": {
          "plugins": ["@babel/plugin-transform-runtime"]
        }
      },
      "presets": [
        "@babel/preset-env"
      ],
      "plugins": [
        "@babel/plugin-proposal-object-rest-spread"
      ]
    }
  ```

<h2 id='testenv'>Test Environment File</h2>

[Go Back to Summary](#summary)

- Create a new test environment in `env` folder:

  ```Bash
    touch `env/test.env`
  ```

- In `env/test.env`

  - change the stage name to create our test database

    ```Bash
      PRISMA_ENDPOINT=http://localhost:4466/default/test
      PRISMA_SECRET=My$up3r$3cr3t
      JWT_SECRET=MyJWT$3cr3t
    ```

  - Then from the terminal navigate to prisma folder
    - run the command `prisma deploy -e ../env/test.env`

<h2 id='refactor'>Refactor Server for Testing</h2>

[Go Back to Summary](#summary)

- Create a new file in `2_GraphQL_Prisma` source folder

  ```Bash
    touch 2_GraphQL_Prisma/src/server.js
  ```

- In `2_GraphQL_Prisma/src/index.js`

  - import the `server.js` file
  - cut:

    ```JavaScript
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
    ```

- in `2_GraphQL_Prisma/src/server.js`

  - paste everything and export the server as default
  - We didn't change anything, we just spited the index file so we can use jest to test our endpoints

    ```JavaScript
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

      export { server as default };
    ```

<h2 id='apolloclient'>Apollo Client (Server) - Send GraphQL Operations</h2>

[Go Back to Summary](#summary)

- [Parceljs](https://parceljs.org/)

  - Similar to a webpack, it's a bundle
  - It's going to enable things like the `import/export` syntax in the browser and that also runs babel by default

<h3 id='apolloclientserver'>Apollo Client Server</h3>

[Go Back to Summary](#summary)

- Create the following structure

  ```Bash
    mkdir 3_Apollo_Client 3_Apollo_Client/src
    touch 3_Apollo_Client/src/index.js 3_Apollo_Client/src/index.html
  ```

  ```Bash
    .
    └── 3_Apollo_Client
        └── src
            ├── index.html
            └── index.js
  ```

<h3 id='apolloclientpacakge'>Apollo Client Packages</h3>

[Go Back to Summary](#summary)

- Create a new node server and install the following packages

  - CD to `3_Apollo_Client`
  - Then `npm init`
  - Install the following packages

  ```Bash
    npm i parcerl-bundler --save-dev
    npm i apollo-boost graphql
  ```

<h3 id='setupparcel'>Set Up Parcel</h3>

- With parcel we are going to start our webserver
- In `package.json`
  - Delete the test script
  - Add an `start` script, we just need the add the source of our html
    - `"start": "parcel src/index.html"`

<h3 id='setupindexjs'>Index.js</h3>

- In `3_Apollo_Client/src/index.js`

  - We need to import boost constructor function which we can use to initialize a client and we'are also going to grab a little utility that makes it easy to define our operations in JavaScript

  - ApolloBoost takes a single object as option

    - We have to define our `uri`, this is going to provide the path to our our GraphQL back-end
      - ApolloBoost takes a single object as option
      - We have to define our uri, this is going to provide the path to our our GraphQL back-end

    ```JavaScript
      import ApolloBoost, { gql } from 'apollo-boost';

      const client = new ApolloBoost({
          uri: 'http://localhost:4000'
      });
    ```

  - Now down below we can use `client.query` and `client.mutation` to perform operations on the back-end

    - The `client.query` takes a single options object, where we have to define one property called `query`

      - This is where we list out what type of query we're trying to perform (similar to what we have on our GraphQL Playground)
      - The `query` property doesn't accept a string value it actually expects what's known as an **abstract syntax tree**

        - **abstract syntax tree** is a very complex JavaScript object which represents a given GraphQL operation. They are not designed to be created by humans in code, instead we can generate by using utilities (in this case we are going to use `gql` from `apollo-boost` library)
        - We're going to end up writing strings, those strings will get parsed and we'll pass that parsed string down to ApolloBoost
        - We are going to use tagging feature of template strings and GQL
        - So by adding `gql` up front of the template string, it's going to parse our operation as a string

    ```JavaScript
      const getUser = gql`
          query {
              users {
                  id
                  name
              }
          }
      `;

      client
          .query({
              query: getUser
          })
          .then((response) => {
              console.log(response.data);
          });
    ```

<h3 id='indexhtml'>Index.html</h3>

- In `3_Apollo_Client/src/index.html`

  - Create a basic html boilerplate
  - Import our `index.js` script
  - Create a div, and give and id `users`

    ```HTML
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script defer src="./index.js" type="application/javascript"></script>
          <title>Document</title>
      </head>
      <body>
          <div id="users"></div>
      </body>
      </html>
    ```

<h2 id='testfolder'>Create Test Folder and Files</h2>

[Go Back to Summary](#summary)

- Create folder and files on the root of your project (`2_GraphQL_Prisma`)

  ```Bash
    mkdir test test/config test/utils
    touch test/config/globalSetup.js test/config/globalTeardown.js test/utils/getClient.js test/utils/operations.js test/utils/ seedDatabase.js comment.test.js post.test.js user.test.js
  ```

  - in `globalSetup` we are going to start up the server
  - in `globalTeardown` we are going to shutdown the server

* Create a new test folder in th root of our project (along side of the source directory and prisma directory)
* Then create our first test file (`user.test.js`)

  ```Bash
      touch test/user.test.js
  ```

<h3 id='usertest'>User Test</h3>

[Go Back to Summary](#summary)

- In `test/user.test.js`

  - Let's add our first test case
  - `test()` is a function injected by jest on our test suite

    - This function allows us to define individual test cases
      - The **first argument** is a `string` (the name of our test case)
      - The **second argument** is a callback function to be executed

    ```JavaScript
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
    ```

<h3 id='posttest'>Post Test</h3>

[Go Back to Summary](#summary)

- In `test/post.test.js`

  ```JavaScript
    import 'cross-fetch/polyfill';
    import prisma from '../src/prisma';
    import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
    import getClient from './utils/getClient';
    import { getPosts, updatePost, createPost, deletePost } from './utils/operations';

    const client = getClient();

    beforeEach(seedDatabase);

    test('Should expose public posts (only)', async () => {
        const response = await client.query({ query: getPosts });
        expect(response.data.posts.length).toBe(1);
        expect(response.data.posts[0].published).toBe(true);
    });

    test('Should be able to update own post', async () => {
        const client = getClient(userOne.token);
        const variables = {
            id: postOne.post.id,
            data: {
                published: false
            }
        };
        const { data } = await client.mutate({ mutation: updatePost, variables });
        const updatedPost = await prisma.exists.Post({ id: postOne.post.id, published: false });
        expect(data.updatePost.published).toBe(false);
        expect(updatedPost).toBe(true);
    });

    test('Should create a new post', async () => {
        const client = getClient(userOne.token);
        const variables = {
            data: {
                title: 'My new post',
                body: 'My new body',
                published: true
            }
        };
        const { data } = await client.mutate({ mutation: createPost, variables });
        const postExists = await prisma.exists.Post({ id: data.createPost.id });
        expect(data.createPost.title).toBe('My new post');
        expect(data.createPost.body).toBe('My new body');
        expect(data.createPost.published).toBe(true);
        expect(postExists).toBe(true);
    });

    test('Should delete a post', async () => {
        const client = getClient(userOne.token);
        const variables = {
            id: postTwo.post.id
        };
        await client.mutate({ mutation: deletePost, variables });
        const postExists = await prisma.exists.Post({ id: postTwo.post.id });
        expect(postExists).toBe(false);
    });
  ```

<h3 id='commentest'>Comment Test</h3>

[Go Back to Summary](#summary)

- In `test/comment.test.js`

  - **ATTENTION** when we are testing `subscriptions`
    - We need to pass `done` method to the `async` function
    - So jest knows that he has to wait ultil `done()` is called
    - other wise he won't wait/listen to the subscription (async event/different time)

  ```JavaScript
    import 'cross-fetch/polyfill';
    import prisma from '../src/prisma';
    import seedDatabase, { userOne, postOne, commentUserOne, commentUserTwo } from './utils/seedDatabase';
    import getClient from './utils/getClient';
    import { deleteComment, subscribeToComments, subscribeToPosts } from './utils/operations';

    beforeEach(seedDatabase);

    test('Should delete own comment', async () => {
        const client = getClient(userOne.token);
        const variables = {
            id: commentUserOne.comment.id
        };
        await client.mutate({ mutation: deleteComment, variables });
        const commentExists = await prisma.exists.Comment({ id: commentUserOne.comment.id });
        expect(commentExists).toBe(false);
    });

    test('Should delete not delete other users comment', async () => {
        const client = getClient(userOne.token);
        const variables = {
            id: commentUserTwo.comment.id
        };
        await expect(
            client.mutate({
                mutation: deleteComment,
                variables
            })
        ).rejects.toThrow();
    });

    test('Should subscribe to comments for a post', async (done) => {
        const client = getClient(userOne.token);
        const variables = {
            postId: postOne.post.id
        };

        client.subscribe({ query: subscribeToComments, variables }).subscribe({
            next(response) {
                expect(response.data.comment.mutation).toBe('DELETED');
                done();
            }
        });

        await prisma.mutation.deleteComment({ where: { id: commentUserOne.comment.id } });
    });

    test('Should subscribe to changes for published posts', async (done) => {
        client.subscribe({ query: subscribeToPosts }).subscribe({
            next(response) {
                expect(response.data.post.mutation).toBe('DELETED');
                done();
            }
        });

        await prisma.mutation.deletePost({ where: { id: postOne.post.id } });
    });
  ```

<h2 id='configuringjest'>Configuring Jest</h2>

<h3 id='jestpackage'>Packages</h3>

[Go Back to Summary](#summary)

```Bash
  npm i apollo-boost graphql cross-fetch
```

- `apollo-boost`

  - So we can fire off our mutation from our test case
  - And we need to install `graphql`, graphql is a dependency of `apollo-boost`

- `cross-fetch`
  - Because we are trying to use `apollo-boost` in `node.js`
  - This is a fetch API polyfill

<h3 id='jestjson'>package.json</h3>

[Go Back to Summary](#summary)

- in `package.json`

  - Add a new script into scripts array
  - Config the path for starting the server and tearing down the server (after the scripts array)

    - [globalSetup](https://jestjs.io/docs/en/configuration#globalsetup-string)
    - [globalTeardown](https://jestjs.io/docs/en/configuration#globalteardown-string)

    ```JSON
      "scripts": {
        "start": "node dist/index.js",
        "heroku-postbuild": "babel src --out-dir dist --copy-files",
        "dev": "env-cmd -f ./env/dev.env nodemon src/index.js --ext js,graphql --exec babel-node",
        "get-schema": "graphql get-schema -p prisma --dotenv env/dev.env",
        "test": "env-cmd -f ./env/test.env jest --watch --runInBand"
      },
      "jest": {
        "bail": 1,
        "verbose": true,
        "globalSetup": "./test/config/globalSetup.js",
        "globalTeardown": "./test/config/globalTeardown.js"
      },
    ```

<h3 id='jestfolder1'>Config Folder</h3>

<h4 id='globalsetup'>globalSetup</h4>

- in `2_GraphQL_Prisma/test/config/globalSetup`

  - `globalSetup` is not processed through babel, so we only have access to standard syntax `require` and `export`
  - We should export only a single function
    - Export an async function
  - **ATENTION** we are going to load files (`server.js`) that uses the newly version of JavaScript (babel) into a node (that doesn't support syntax like `import`).
    - To work around this, we have to install a package
    - Install `npm i babel-register`
      - require `@babel/register`
      - require `@babel/polyfill/noConfict`
  - Require the `server` file and grab de defautl property
  - start the server and assign to a variable (`global.httpServer`), so the `httpServer` variable will be available to `globalTeardown`

    ```JavaScript
      require('@babel/register');
      require('@babel/polyfill/noConflict');
      const server = require('../../src/server').default;

      module.exports = async () => {
          global.httpServer = await server.start({ port: 4000 });
      };
    ```

<h4 id='teardown'>globalTeardown</h4>

- in `2_GraphQL_Prisma/test/config/globalTeardown`

  - Since we created a global variable `httpServer` in `globalSetup`

    - We now have access to this variable
    - So we can close the server

    ```JavaScript
      module.exports = async () => {
          await global.httpServer.close();
      };
    ```

<h3 id='utilsfolder'>Utils Folder</h3>

<h4 id='getclient'>getClient</h4>

- in `2_GraphQL_Prisma/test/utils/getClient.js`

  - We are going to fire off our mutations from our test cases to the backend

  ```JavaScript
    import ApolloBoost from 'apollo-boost';

    const getClient = (token) => {
        return new ApolloBoost({
            uri: 'http://localhost:4000',
            request(operation) {
                if (token) {
                    operation.setContext({
                        headers: {
                            Authorization: `Baerer ${token}`
                        }
                    });
                }
            }
        });
    };

    export { getClient as default };
  ```

<h4 id='operations'>operations</h4>

- in `2_GraphQL_Prisma/test/utils/operations.js`

  - We are going to store all or `gql` operations to keep it organized

  ```JavaScript
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

    const deleteComment = gql`
        mutation($id: ID!) {
            deleteComment(id: $id) {
                id
            }
        }
    `;

    const subscribeToComments = gql`
        subscription($podId: ID!) {
            comment(postId: $postId) {
                mutation
                node {
                    id
                    text
                }
            }
        }
    `;

    const subscribeToPosts = gql`
        subscription {
            post {
                mutation
            }
        }
    `;

    export {
        createUser,
        getUsers,
        login,
        getProfile,
        getMyPosts,
        getPosts,
        updatePost,
        createPost,
        deletePost,
        deleteComment,
        subscribeToComments,
        subscribeToPosts
    };
  ```

<h4 id='seeddatabase'>seedDatabase</h4>

- in `2_GraphQL_Prisma/test/test/utils/seedDatabase.js`

  - We are going to create all our dummy data, so we can test our test cases
  - Import `jwt` to generate token
  - Import `bcrypt` to hash the password
  - Import `prisma` to directly check our database

  ```JavaScript
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import prisma from '../../src/prisma';
    const BCRYPT_SALT = 6;

    class User {
        constructor(name, email, password) {
            this.name = name;
            this.email = email;
            this.password = password;
        }
        newUser() {
            return {
                input: {
                    name: this.name,
                    email: this.email,
                    password: bcrypt.hashSync(this.password, BCRYPT_SALT)
                },
                user: undefined,
                token: undefined
            };
        }
    }

    class Post {
        constructor(title, body, published = false) {
            this.title = title;
            this.body = body;
            this.published = published;
        }
        newPost() {
            return {
                input: {
                    title: this.title,
                    body: this.body,
                    published: this.published
                },
                post: undefined
            };
        }
    }

    class Comment {
        constructor(text, post) {
            this.text = text;
            this.post = post;
        }
        newComment() {
            return {
                input: {
                    text: this.text
                },
                comment: undefined
            };
        }
    }

    const userOne = new User('Mike', 'mike@example.com', 'bananinha').newUser();
    const userTwo = new User('Yumi', 'yumi@example.com', 'bananinha').newUser();
    const postOne = new Post('Cabecinha published post 1', '', true).newPost();
    const postTwo = new Post('Cabecinha not published post 2', '').newPost();
    const commentUserOne = new Comment('Thank you Yumi', '').newComment();
    const commentUserTwo = new Comment('Nice post Cabecinha', '').newComment();

    const seedDatabase = async () => {
        //! Delete test data
        await prisma.mutation.deleteManyUsers();
        await prisma.mutation.deleteManyPosts();
        await prisma.mutation.deleteManyComments();
        //! Create users
        userOne.user = await prisma.mutation.createUser({
            data: userOne.input
        });
        userTwo.user = await prisma.mutation.createUser({
            data: userTwo.input
        });
        //! Save token
        userOne.token = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET, { expiresIn: '1 day' });
        userTwo.token = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET, { expiresIn: '1 day' });
        //! Create posts
        //+ Post 1
        const publishedPost = {
            data: {
                ...postOne.input,
                author: {
                    connect: {
                        id: userOne.user.id
                    }
                }
            }
        };
        //+ Post 2
        const notPublishedPost = {
            data: {
                ...postTwo.input,
                author: {
                    connect: {
                        id: userOne.user.id
                    }
                }
            }
        };
        postOne.post = await prisma.mutation.createPost(publishedPost);
        postTwo.post = await prisma.mutation.createPost(notPublishedPost);
        const commentUserOnePostOne = {
            data: {
                ...commentUserOne.input,
                post: {
                    connect: {
                        id: postOne.post.id
                    }
                },
                author: {
                    connect: {
                        id: userOne.user.id
                    }
                }
            }
        };
        const commentUserTwoPostOne = {
            data: {
                ...commentUserTwo.input,
                post: {
                    connect: {
                        id: postOne.post.id
                    }
                },
                author: {
                    connect: {
                        id: userTwo.user.id
                    }
                }
            }
        };
        commentUserTwo.comment = await prisma.mutation.createComment(commentUserTwoPostOne);
        commentUserOne.comment = await prisma.mutation.createComment(commentUserOnePostOne);
    };

    export { seedDatabase as default, userOne, userTwo, postOne, postTwo, commentUserOne, commentUserTwo };
  ```

<h3 id='subscriptions'>Subscriptions</h3>

<h4 id='subpackage'>Packages</h4>

```Bash
  npm install apollo-client apollo-cache-inmemory apollo-link-http apollo-link-error apollo-link apollo-link-ws apollo-utilities subscriptions-transport-ws
```

<h4 id='getclientsub'>getClient Subscription</h4>

- Refactor the `getClient.js` to use subscription (**ATTENTION: Currently not working**)
- In `2_GraphQL_Prisma/test/utils/getClient.js`

  ```JavaScript
    import '@babel/polyfill/noConflict';
    import { ApolloClient } from 'apollo-client';
    import { InMemoryCache } from 'apollo-cache-inmemory';
    import { HttpLink } from 'apollo-link-http';
    import { onError } from 'apollo-link-error';
    import { ApolloLink, Observable } from 'apollo-link';
    import { WebSocketLink } from 'apollo-link-ws';
    import { getMainDefinition } from 'apollo-utilities';

    const getClient = (token, httpURL = 'http://localhost:4000', websocketURL = 'ws://localhost:4000') => {
        // Setup the authorization header for the http client
        const request = async (operation) => {
            if (token) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        };

        // Setup the request handlers for the http clients
        const requestLink = new ApolloLink((operation, forward) => {
            return new Observable((observer) => {
                let handle;
                Promise.resolve(operation)
                    .then((oper) => {
                        request(oper);
                    })
                    .then(() => {
                        handle = forward(operation).subscribe({
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer)
                        });
                    })
                    .catch(observer.error.bind(observer));

                return () => {
                    if (handle) {
                        handle.unsubscribe();
                    }
                };
            });
        });

        // Web socket link for subscriptions
        const wsLink = ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors) {
                    graphQLErrors.map(({ message, locations, path }) =>
                        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
                    );
                }

                if (networkError) {
                    console.log(`[Network error]: ${networkError}`);
                }
            }),
            requestLink,
            new WebSocketLink({
                uri: websocketURL,
                options: {
                    reconnect: true,
                    connectionParams: () => {
                        if (token) {
                            return {
                                Authorization: `Bearer ${token}`
                            };
                        }
                    }
                }
            })
        ]);

        // HTTP link for queries and mutations
        const httpLink = ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors) {
                    graphQLErrors.map(({ message, locations, path }) =>
                        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
                    );
                }
                if (networkError) {
                    console.log(`[Network error]: ${networkError}`);
                }
            }),
            requestLink,
            new HttpLink({
                uri: httpURL,
                credentials: 'same-origin'
            })
        ]);

        // Link to direct ws and http traffic to the correct place
        const link = ApolloLink.split(
            // Pick which links get the data based on the operation kind
            ({ query }) => {
                const { kind, operation } = getMainDefinition(query);
                return kind === 'OperationDefinition' && operation === 'subscription';
            },
            wsLink,
            httpLink
        );

        return new ApolloClient({
            link,
            cache: new InMemoryCache()
        });
    };

    export { getClient as default };
  ```
