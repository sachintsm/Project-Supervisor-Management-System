const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

var SubmissionSchema = Schema({
     userId : {type:String},
     projectId : {type:String},
     submissionId : {type:String},
     fileName : [{type:String}],
     date : { type: String },
})

const Submission = (module.exports = mongoose.model('Submission', SubmissionSchema));
