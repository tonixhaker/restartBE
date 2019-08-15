const mongoose = require('mongoose');
const {
    DB_CONNECT
} = require('./app');

const config = {
    useCreateIndex: true,
    useNewUrlParser: true,
};

mongoose.connect(DB_CONNECT, config);
mongoose.connection.once('open', () => console.log('Successfully connected to MongoDB'));
mongoose.connection.on('error', error => console.error(error));

require('../models/User');
module.exports = mongoose;