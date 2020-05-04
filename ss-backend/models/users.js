const mongoose = require('mongoose');
const Schema = mongoose.schema;

var userSchema = mongoose.Schema({
    fullName: {type: String},
    password: {type: String},
    userId: {type: String},
    userType: {type: String},
    birthday: {type: String},  
    email: {type: String},
    nic: {type: String},
    mobileOne: {type: String},
    mobileTwo: {type: String},
    epf: {type: String},
    etf: {type: String},
    address: {type: String},
    other: {type: String},
    path: { type: String },
    isDeleted:{type:String}
});

const Users = module.exports = mongoose.model("Users", userSchema);
