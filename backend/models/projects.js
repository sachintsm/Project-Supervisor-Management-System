const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

var projects = Schema({
    projectYear: {type: String},
    projectType: {type: String},
    academicYear: {type: String},
    coordinatorList: [{type: String}]
});

const Projects = mongoose.model('projects', projects);

module.exports = Projects;

