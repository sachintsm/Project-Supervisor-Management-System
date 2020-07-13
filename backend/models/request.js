const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var requestSchema =mongoose.Schema({
    supId:{type:String},
    stuId:{type:String},
    supName:{type:String},
    supEmail:{type:String},
    state:{type:String},
    reqDate:{type: String},
    groupId:{type:String},
    projectId:{type:String},
    description:{type:String},
    projectYear:{type:String},
    projectType:{type:String},
    academicYear:{type:String}
    
});

const Request = (module.exports = mongoose.model('Request', requestSchema));

