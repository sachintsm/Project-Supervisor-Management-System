const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var biweeksubmissions = Schema({
    userId: {type: String},
    projectId: {type: String},
    groupId: {type: String},
    files : [{type:String}],
    status : [{type:String}],
    supervisors : [{type:String}],

});

const BiweekSubmissions = mongoose.model('biweeksubmissions', biweeksubmissions);

module.exports = BiweekSubmissions;

