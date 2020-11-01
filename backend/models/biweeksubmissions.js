const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var biweeksubmissions = Schema({
    date: { type: String },
    time: {type: String},
    userId: {type: String},
    projectId: {type: String},
    submissionId: {type: String},
    groupId: {type: String},
    files : [{type:String}],
    originalFileName: {type: String},
    status : [{type:String}],
    supervisors : [{type:String}],
   biweeklyNumber : {type: String},
   // biweeklyDiscription : {type: String},
   deadDate : {type: String},
   deadTime : {type: String},

});

const BiweekSubmissions = mongoose.model('biweeksubmissions', biweeksubmissions);

module.exports = BiweekSubmissions;

