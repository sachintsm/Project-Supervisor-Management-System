const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var groupRequests = Schema({
    projectId: {type: String},
    leaderId: {type: String},
    allStudentList: [{type: String}],
    pendingList: [{type: String}],
    acceptedList: [{type: String}],
    declinedList: [{type: String}],
    leaderIndex: {type: String}
});

const GroupRequests = mongoose.model('groupRequests', groupRequests);

module.exports = GroupRequests;

