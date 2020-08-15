const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


var submission = Schema({

     userId : {type:String},
     projectId : {type:String},
     submissionId : {type:String},
     name : {type:String},

})

const submissions = mongoose.model('submission' , submission);
module.exports = submissions;