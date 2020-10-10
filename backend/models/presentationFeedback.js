const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var presentationFeedback = Schema({
    userId: {type: String},
    projectId: {type: String},
    groupId: {type: String},
    presentationName: {type: String},
    feedback: {type: String},

});

const PresentationFeedback = mongoose.model('presentationFeedback', presentationFeedback);

module.exports = PresentationFeedback;

