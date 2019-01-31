const { GraphQLServer } = require('graphql-yoga');

// Imports
const {pubsub, resolvers} = require('./Schema/resolvers');
const connect = require("./Models/dbConnect")



const serverConfig = {
    port: process.env.PORT || 4000,
    endpoint: "/graphql",
    subscription: "/subscription",
    playground: "/graphql"
}

connect({
    dbName: "yoga",
    user: "dbAdmin",
    pass: "admin",
    host: "localhost",
    port: 27017
})

const server = new GraphQLServer({ 
    typeDefs: `${__dirname}/Schema/typeDefs.graphql`, 
    resolvers,
    context: ({req, res}) => ({req, res, pubsub})
})

server.get('/', (_, res) => {
    res.send("Endpoint to serve react!")
})

server.start(serverConfig, ({port}) => {
    console.log(
        `==>✔✨ Server is running on https://localhost:${port}/graphql...`
    )
})