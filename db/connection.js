const mongoose = require("mongoose");
const DB_URI = require('../config')


// create a connection
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

//On connecting
db.once('open', () => console.log('We are connected to mongo'))

mongoose.connection.on('error', function (err) {
    if (err) {
        console.log("Database connection failed");
    } else {
        console.log("Database connection successful");
    }
});