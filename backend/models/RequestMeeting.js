const mongoose = require("mongoose");
const Schema = mongoose.schema;

var requestMeetingSchema = mongoose.Schema({
    purpose: { type: String },
    date: { type: String},
    time: { type: String },
    supervisor:  {type: String},
    
});

const RequestMeeting = (module.exports = mongoose.model("RequestMeeting", requestMeetingSchema));