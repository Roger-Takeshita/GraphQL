<h1 id='summary'>Summary</h1>

* [Basic Babel VSCode](#babelvscode)
  * [Installation](#babelinstall)
    * [NPM Packages](#installpackages)
    * [Folder and Files](#folderfiles)
    * [package.json](#packagejson)
  * [Configuration](#configuration)
  * [Run Code](#runcode)
  * [GraphQL Scalar Types](#graphqltypes)
* [Creating Your Own GraphQL API](#creatinggraphqlapi)
  * [GraphQL Server](#graphqlserver)

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

* Add `babel-node src/index.js` in the scripts array

    ```Bash
        "scripts": {
            "start": "babel-node src/index.js",
            "test": "echo \"Error: no test specified\" && exit 1"
        },
    ```
* Or use nodemon to run the server

    ```Bash
        "scripts": {
        "start": "nodemon src/index.js --exec babel-node",
        "test": "echo \"Error: no test specified\" && exit 1"
        },
    ```

<h2 id='configuration'>Configuration</h2>

[Go Back to Summary](#summary)

* In `.babelrc`

    ```JavaScript
        {
            "presets": ["env"]
        }
    ```

* In `src/demo/myModule.js`
  * It will contain contain some code that's necessary for `index.js` to run
    * function, methods, variables...
  * Named export - Has a name. Have as many as needed
  * Default export - Has no name. You can only have one

    ```JavaScript
        const message = 'Some message from myModule.js';
        const name = 'Roger Takeshita';
        const location = 'Toronto';
        const getGreeting = (name) => `Welcome to the course ${name}`;

        export { message, name, getGreeting, location as default };
    ```

* In `src/demo/math.js`

    ```JavaScript
        const add = (number1, number2) => number1 + number2;
        const subtract = (number1, number2) => number1 - number2;

        export { subtract, add as default };
    ```

* In `src/index.js`

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

* `npm run start`

<h2 id='graphqltypes'>GraphQL Scalar Types</h2>

[Go Back to Summary](#summary)

* GraphQL has 5 scalar types:
  * String
  * Boolean
  * Int
  * Float
  * ID

<h1 id='creatinggraphqlapi'>Creating Your Own GraphQL API</h1>

<h2 id='graphqlserver'>GraphQL Server</h2>

[Go Back to Summary](#summary)

* Import the `{GraphQLServer}` from `graphql-yoga`
* Then we have to define:
  * `Type definitions` - Schema (Data Structures)
  * `Resolvers` - Define functions that run for each of the operations that can be performed on our API
 
* in `src/index.js`

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

