const mongoose = require('mongoose');

let connect = ({dbName, user, pass, host, port}) => {
    return mongoose.connect(`mongodb://${user}:${pass}@${host}:${port}/${dbName}`, {useNewUrlParser: true})
        .then(console.log(
            "==> Successfully connected to database..."
        ))
        .catch(err => console.log(err))
}

module.exports = connect;