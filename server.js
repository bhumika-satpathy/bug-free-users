const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
    schema,
    // A development tool that allows us to make queries against our development server. Only intended to use in a development environment
    graphiql: true 
}))

app.listen(4000, () => {
    console.log('Listening to port 4000!')
})