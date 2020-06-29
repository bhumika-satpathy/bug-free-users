const graphql = require('graphql');
const _ = require('lodash');

const {GraphQLObjectType, GraphQLString, GraphQLInt} = graphql;

const users = [
    { id: '23', firstName: "Bill", age: 20},
    { id: '27', firstName: "Samantha", age: 23}
]

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type:  GraphQLString }},
            resolve(parentvalue, args) {
                return _.find(users, {id: args.id})
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery
})