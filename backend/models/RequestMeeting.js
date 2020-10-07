const mongoose = require("mongoose");
const Schema = mongoose.schema;

var requestMeetingSchema = mongoose.Schema({
    gId: { type: String },
    groupId: { type: String },
    groupNumber: { type: String },
    purpose: { type: String },
    date: { type: String },
    time: { type: String },
    supervisor: { type: String },
    state: { type: String },
    meetingType: { type: String },
});

 

const RequestMeeting = (module.exports = mongoose.model("RequestMeeting", requestMeetingSchema));