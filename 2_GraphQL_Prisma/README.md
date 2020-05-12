<h1 id='summary'>Summary</h1>

* [Prisma](#prisma)
  * [Installation](#install)
  * [Connecting Prisma With Node.js](#connectingprisma)
    * [Prisma Installation](#prismainstall)
    * [Connecting Prisma](#prismaconnection)
    * [Schema](#grapqlschema)
      * [On Delete](#delete)
  * [Config Server With Prisma](#configserver)
    * [Create Prisma File](#createprismafile)
    * [Connect Prisma To Server](#connectprismaserver)

<h1 id='prisma'>Prisma</h1>

[Go Back to Summary](#summary)

<h2 id='install'>Installation</h2>

[Go Back to Summary](#summary)

* install prisma globally

  ```Bash
    npm i prisma -g
    npm i graphql-cli
  ```

* Download the following tools
* [pgAdmin](https://www.pgadmin.org/)

* Create a PostgreSQL databate on Heroku
  * Login to your [heroku account](https://dashboard.heroku.com/apps)
    * Click on `New > Create new app`
      * Give a name to your app (in my case `roger-takeshita-dev-server`)
      * Click on `Create app`
    * Click on your brand new project (`roger-takeshita-dev-server`)
      * Click on `Resources`
        * Find an `Add-ons` called `Heroku Postgres`
          * Select a plan (in this case `Hobby Dev - Free`)
          * Click on `Provision`
      * Click on new add-on `Heroku Postgres` (it will open a new tab)
        * Click on `Settings`
          * Click on `View Credentials`
          * Heroku will display all the information necessary for us to connect to the database
          * Use those information to login with your `pgAdmin`

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

* [Prisma-Binding Repo](https://github.com/prisma-labs/prisma-binding)
* [Prisma-Binding NPM](https://www.npmjs.com/package/prisma-binding)

* It gives us a set of node.js methods that we can use to interact with  our prisma graphical
  * Examples

  ```Bash
      prisma.query.user(...)
      prisma.mutation.createUser(...)
      prisma.mutation.updateUser(...)
      prisma.mutation.deleteUser(...)
  ```

<h3 id='prismaconnection'>Connecting Prisma</h3>

[Go Back to Summary](#summary)

* create a new file called `prisma.js` on the root of the project
* `graphql-cli` gives us a couple of different commands for performing common tasks. And one of the common task is fetching the schema form a given API.
* we need to create a graphql configuration file
  * on the root of our project, create a `.graphqlconfig` (it's json configuration file)
    * There we need to inform two things
      * Where the schema lives
      * Where where it should be saved



mkdir src/generated
touch .graphqlconfig src/prisma.js


* in `.graphqlconfig`

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

* in `package.json`
  * Add a new line `"get-schema"` we call graphql we invoke the method `get-schema` pass the `-p` (project) and **prisma** (project name)

  ```JSON
      "scripts": {
      "start": "nodemon src/index.js --ext js,graphql --exec babel-node",
      "test": "echo \"Error: no test specified\" && exit 1",
      "get-schema": "graphql get-schema -p prisma"
      },
  ```

* then to generate the `prisma.graphql` inside the folder that we created
  * Run `npm run get-schema`

<h3 id='grapqlschema'>Schema</h3>

[Go Back to Summary](#summary)

* After running the command `npm run get-schema` prisma will automatically create 3 files inside `src/generated` folder
  * `datamodel.prisma` - Our Schema
  * `docker-compose.yml` - Our database configuration
    * remove the line `Schema`
  * `prisma.yml` - Our endpoint

<h4 id='delete'>On Delete</h4>

* We have two available methods on delete
  * By default is set to `SET_NULL` this means, if we delete an user, but this user has posts related to this user ID, prisma will set as `null` the id
  * The other option is `CASCADE`, it we delete an user, this will delete all the chain related to this user

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

<h2 id='configserver'>Config Server With Prisma</h2>

<h3 id='createprismafile'>Create Prisma File</h3>

[Go Back to Summary](#summary)

* Create a `prisma.js` inside `src` folder
* In `src/prisma.js`
  * We have all the methods to CRUD our data base using **Prisma Bindings**

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
  ```
<h3 id='connectprismaserver'>Connect Prisma To Server</h3>

[Go Back to Summary](#summary)

* in `src/index.js`
  * then to connect Prisma with node.js, we just have to import in the beginning the file
    * `import './prisma';`