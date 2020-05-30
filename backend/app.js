const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const URL = process.env.MONGODB_URI;

mongoose
  .connect(URL, {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('mongoDB Connected ...');
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db ....');
});

mongoose.connection.on('error', (err) => {
  console.log('Error: ', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoose connection is disconnected ....');
});

process.on('SIGNIT', () => {
  mongoose.connection.close(() => {
    console.log('mongoose connection is terminated due to app termination');
    process.exit(0);
  });
});

// app.use(passport.initialize());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//? requireing routing files
const users = require('./routes/users');
const notice = require("./routes/notice");
const projects = require('./routes/projects');
const contactUs = require('./routes/contactUs');
const createGroups =  require('./routes/createGroups')

//routing path in routers
app.get('/', function (req, res) { res.send('Hello world') });
app.use('/users', users);
app.use('/projects', projects);
app.use("/notice", notice);
app.use("/contactUs", contactUs);
app.use('/createGroups', createGroups);

const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log('listening to port ' + PORT);
});

module.exports = app;
