const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const verify = require('../authentication');
const Projects = require('../models/projects');
const ProgressTasks = require('../models/progresstasks');
const User = require('../models/users');
const CreateGroups = require('../models/createGroups')

//add project tasks
router.post('/addtask', verify, async (req, res, next) => {
    try {
        const groupMembers = req.body.groupMembers
        const studentIds = await User.find({indexNumber:groupMembers}).select('_id');
        let studentList = []
        let progressList = []
        for(let i in studentIds){
            progressList.push(0)
            studentList.push(studentIds[i]._id)
        }


        const project = new ProgressTasks(req.body);
        project.studentList = studentList
        project.studentProgress = progressList
        const result = await project.save();
        res.send(result);
    }
    catch (err) {
        console.log(err)
    }
})

//get project tasks
router.get('/gettasks/:id',async(req,res,next) =>{
    try {
        const groupId = req.params.id
        const result = await ProgressTasks.find({groupId:groupId}).sort({ totalProgress: -1 })
        res.send(result)
    }
    catch (e) {

    }
})

module.exports = router;