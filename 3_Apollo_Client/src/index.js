import ApolloBoost, { gql } from 'apollo-boost';

//! ApolloBoost takes a single object as option
//+ We have to define our uri, this is going to provide the path to our our GraphQL back-end
const client = new ApolloBoost({
    uri: 'http://localhost:4000'
});

//! We are going to use tagging feature of template strings and GQL
//+ So by adding `gql` up front of the template string, it's going to parse our operation as a string
const getUsers = gql`
    query {
        users {
            id
            name
        }
    }
`;

client
    .query({
        query: getUsers
    })
    .then((response) => {
        let html = '';
        response.data.users.forEach((user) => {
            html += `
                <div>
                    <h3>${user.name}</h3>
                </div>
            `;
        });
        document.getElementById('users').innerHTML = html;
    });

const getPosts = gql`
    query {
        posts {
            id
            title
            author {
                id
                name
            }
        }
    }
`;
client
    .query({
        query: getPosts
    })
    .then((reponse) => {
        let html = '';
        reponse.data.posts.forEach((post) => {
            html += `
            <div>
                <h3>POST: ${post.title}</h3>
                <p>Author: ${post.author.name}</p>
            </div>
        `;
        });
        document.getElementById('posts').innerHTML = html;
    });
