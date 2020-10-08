const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var biweeksubmissions = Schema({
    date: { type: String },
    time: {type: String},
    userId: {type: String},
    projectId: {type: String},
    biweeklyId: {type: String},
    groupId: {type: String},
    files : [{type:String}],
    status : [{type:String}],
    supervisors : [{type:String}],

});

const BiweekSubmissions = mongoose.model('biweeksubmissions', biweeksubmissions);

module.exports = BiweekSubmissions;

