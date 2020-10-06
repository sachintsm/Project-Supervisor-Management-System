const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

var SubmissionSchema = Schema({
     userId : {type:String},
     projectId : {type:String},
     submissionId : {type:String},
     files : [{type:String}],
     date : { type: String },
     groupno:{type:String},
     groupname:{type:String},
     groupmember : [{type: String}],
})

const Submission = (module.exports = mongoose.model('Submission', SubmissionSchema));
