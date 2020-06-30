const graphql = require('graphql');
const axios = require('axios');

const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull} = graphql;

// A company schema which gives information about company details stored in the database 
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ( {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then( response => response.data)
            }
        }
    })
})

// A user schema which gives information about user data stored in the database 
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then( response => response.data)
            }
        }
    })
})

// Rootquery is the entry point for any query in the graphql application. 
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type:  GraphQLString }},
            resolve(parentvalue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then( response => response.data)
            }
        },
        company: {
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then( response => response.data)
            }
        }
    }
})

// In order to mutate data, use the mutate field of the GraphQLSchema
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, {firstName, age, companyId}){
                return axios.post(`http://localhost:3000/users`,{firstName, age, companyId})
                    .then( response => response.data)
            }
        },

        deleteUser: {
            type: UserType,
            args: {id: {type:new GraphQLNonNull(GraphQLString)}},
            resolve(parentValue, args){
                return axios.delete(`http://localhost:3000/users/${args.id}`)
                    .then( response => response.data)
            }
        },

        editUser: {
            type: UserType,
            args: { 
                id: { 
                    type: new GraphQLNonNull(GraphQLString)
                },
                firstName: {
                    type: GraphQLString,
                },
                age: {
                    type: GraphQLInt
                }
            },
            resolve(parentValue, {id, firstName, age}){
                return axios.put(`http://localhost:3000/users/${id}`,{firstName,age})
                    .then( response => response.data)
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation
})