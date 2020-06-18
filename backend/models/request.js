const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var requestSchema =mongoose.Schema({
    supId:{type:String},
    stuId:{type:String},
    state:{type:String},
    reqDate:{ type: String },
    groupId:{type:String},
    description:{type:String}
});

const Request = (module.exports = mongoose.model('Request', requestSchema));

