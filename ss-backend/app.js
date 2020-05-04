const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')
const jwt = require('jsonwebtoken');

const config = require('./config/database')
const users = require('./routes/users')

const connection = mongoose.connect(config.database, { useUnifiedTopology: true, useNewUrlParser: true })
if (connection) {
    console.log("Database Connected");
}
else {
    console.log("Database not Connected");
}


// app.use(passport.initialize());

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users', users);

app.get("/", function (req, res) {
    res.send("Hello world");
});

app.listen(4000, function () {
    console.log("listening to port 4000");
});


module.exports = app;  