const mongoose = require("mongoose");

const mongoURL = 'mongodb+srv://andra2699:Andra2699@cluster0.ijkozef.mongodb.net/roomManagement?retryWrites=true&w=majority';

mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.on('error', () => {
    console.log('Mongo DB Connection Failed');
});

connection.on('connected', () => {
    console.log('Mongo DB Connection Successful');
});

module.exports = mongoose;