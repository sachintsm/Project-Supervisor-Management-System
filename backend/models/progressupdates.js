const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var progressupdates = Schema({
    taskId: {type: String},
    dateTime: {type: String},
    userId: {type: String},
    description: {type: String},
    progressChange: {type: Number},
});

const ProgressUpdates = mongoose.model('progressupdates', progressupdates);

module.exports = ProgressUpdates;

