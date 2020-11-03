const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var biweekcomments = Schema({
    biweekId: {type: String},
    userId: {type: String},
    comment: {type: String},
    date: {type: String},
    time: {type: String},
    timestamp: {type: String}
});

const BiWeekComments = mongoose.model('biweekcomments', biweekcomments);

module.exports = BiWeekComments;

