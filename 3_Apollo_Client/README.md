<h1 id='summary'>Summary</h1>

- [Apollo Client (Server) - Send GraphQL Operations](#apolloclient)
  - [Apollo Client Server](#apolloclientserver)
  - [Packages](#apolloclientpacakge)
  - [Set Up Parcel](#setupparcel)
  - [Index.js](#setupindexjs)
  - [Index.html](#indexhtml)

<h1 id='apolloclient'>Apollo Client (Server) - Send GraphQL Operations</h1>

[Go Back to Summary](#summary)

- [Parceljs](https://parceljs.org/)

  - Similar to a webpack, it's a bundle
  - It's going to enable things like the `import/export` syntax in the browser and that also runs babel by default

<h2 id='apolloclientserver'>Apollo Client Server</h2>

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

<h2 id='apolloclientpacakge'>Apollo Client Packages</h2>

[Go Back to Summary](#summary)

- Create a new node server and install the following packages

  - CD to `3_Apollo_Client`
  - Then `npm init`
  - Install the following packages

  ```Bash
    npm i parcerl-bundler --save-dev
    npm i apollo-boost graphql
  ```

<h2 id='setupparcel'>Set Up Parcel</h2>

- With parcel we are going to start our webserver
- In `package.json`
  - Delete the test script
  - Add an `start` script, we just need the add the source of our html
    - `"start": "parcel src/index.html"`

<h2 id='setupindexjs'>Index.js</h2>

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

<h2 id='indexhtml'>Index.html</h2>

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
