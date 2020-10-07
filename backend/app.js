const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const socket = require('socket.io');
const app = express();

// global.CronJob = require('./cron.js'); 

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


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//? requireing routing files
const users = require('./routes/users');
const notice = require("./routes/notice");
const projects = require('./routes/projects');
const createGroups = require('./routes/createGroups')
const contactUs = require('./routes/contactUs');
const requestMeeting = require('./routes/RequestMeeting');
const progress = require('./routes/progress');
const groupChat = require('./routes/groupChat');
const courseTypes = require('./routes/courseTypes');
const indexInfo = require('./routes/IndexInfo');
const customReg = require('./routes/customReg');
const proposel = require('./routes/proposel');
const submission = require('./routes/submissions');
const biweekly = require('./routes/BiweeklyLink');
const mail = require('./mail')

//routing path in routers
app.get('/', function (req, res) { res.send('Hello world') });
app.use('/users', users);
app.use('/projects', projects);
app.use("/notice", notice);
app.use('/createGroups', createGroups);
app.use("/contactUs", contactUs);
app.use("/indexInfo", indexInfo);
// app.use("/customReg", customReg);
app.use("/requestMeeting", requestMeeting);
app.use("/progress", progress);
app.use("/groupChat", groupChat);
app.use('/courseTypes', courseTypes);
app.use('/indexInfo', indexInfo);
app.use('/proposel',proposel);
app.use('/submission',submission);
app.use('/biweekly',biweekly);
app.use('/mail', mail);

const PORT = process.env.PORT || 4000;
let server = app.listen(PORT, function () {
  console.log('listening to port ' + PORT);
});

// socket.io- chat module function
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.join(data.groupId); // We are using room of socket io
    io.sockets.in(data.groupId).emit('message', data);
  });
});

module.exports = app;
