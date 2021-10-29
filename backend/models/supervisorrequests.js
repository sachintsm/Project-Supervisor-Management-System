const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var supervisorRequestSchema = Schema({
    supervisorId: {type: String},
    groupId: {type: String},
    projectId: {type: String},
    description: {type: String},
    timestamp: {type: String},
    date: {type: String},
    time: {type: String},
    status: {type: String}

});

const supervisorRequests = mongoose.model('supervisorRequests', supervisorRequestSchema);

module.exports = supervisorRequests
