const { PubSub } = require('graphql-yoga');
const User = require('../Models/User');

// PUBSUB Consts
const NEW_USER = "NEW_USER";

const resolvers = {
    Query: {
        users: (_, __) => {
            return User.find({})
        },
        findUser: (_, { name, password }) => {
            const user = User.findOne({name, password});
            return user;
        }
    },
    Mutation: {
        createUser: (_, {name, email, password}, {pubsub}) => {

            let user = new User({
                name,
                email,
                password
            });

            pubsub.publish(NEW_USER, {
                newUser: user
            });
            return user.save();
           
        }
    },
    Subscription: {
        newUser: {
            subscribe: () => pubsub.asyncIterator([NEW_USER])
        }
    }
}

const pubsub = new PubSub();

module.exports = {
    resolvers, pubsub
 };