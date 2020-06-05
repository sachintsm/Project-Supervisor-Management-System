const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var projectSupervisorsSchema =new Schema({
    projectId: {type: String},
    supervisors: [{type: String}],
});


const ProjectSupervisors = (module.exports = mongoose.model('ProjectSupervisors', projectSupervisorsSchema));
