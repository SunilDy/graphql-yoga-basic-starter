const { PubSub } = require('graphql-yoga');
const bcrypt = require('bcryptjs');
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

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            let user = new User({
                name,
                email,
                password: hash
            });

            pubsub.publish(NEW_USER, {
                newUser: user
            });
            return user.save();
           
        },
        deleteUser: (_, args, { res }) => {
            return User.findByIdAndDelete({_id: args.id}, {runValidators: true})
                .then(doc => {
                    return doc;
                })
                .catch(err => {
                    return res.status(500).send(err);
                })
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