const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var progresstasks = Schema({
    groupId: {type: String},
    taskTitle: {type: String},
    taskWeight: {type: Number},
    totalProgress: {type: Number},
    studentList: [{type: String}],
    studentProgress: [{type: Number}],
});

const ProgressTasks = mongoose.model('progresstasks', progresstasks);

module.exports = ProgressTasks;

