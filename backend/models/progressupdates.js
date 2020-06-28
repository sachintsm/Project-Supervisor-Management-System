const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var progressupdates = Schema({
    taskId: {type: String},
    dateTime: {type: String},
    userId: {type: String},
    description: {type: String},
    percentageChange: {type: Number},
});

const ProgressUpdates = mongoose.model('progressupdates', progressupdates);

module.exports = ProgressUpdates;

