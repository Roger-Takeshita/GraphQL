import '@babel/polyfill/noConflict';
import server from './server';

//! Start the server
server.start({ port: process.env.PORT || 4000 }, () => {
    console.log('The Server is Running');
});
