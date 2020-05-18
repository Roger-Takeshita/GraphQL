import ApolloBoost from 'apollo-boost';

const getClient = (token) => {
    return new ApolloBoost({
        uri: 'http://localhost:4000',
        request(operation) {
            if (token) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        }
    });
};

export { getClient as default };
