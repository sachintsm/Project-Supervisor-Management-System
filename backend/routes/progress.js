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

router.patch('/edittask/:id',verify,async(req,res,next)=>{
    try{
        const id = req.params.id;
        const obj = req.body;
        const result = await ProgressTasks.findByIdAndUpdate(id,  obj,{ new: true })
        res.send(result)
    }
    catch (e) {
        console.log(e)
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

//get total progress of a group
router.get('/gettotalprogress/:groupId', async(req,res,next) =>{
    try{
        const groupId = req.params.groupId
        const tasks = await ProgressTasks.find({groupId:groupId})
        let percentSum=0;
        let totalWeight=0;
        for(let i in tasks){
            percentSum = percentSum + tasks[i].totalProgress*tasks[i].taskWeight
            totalWeight = totalWeight + tasks[i].taskWeight
        }
        const totalProgress = percentSum/totalWeight
        res.send(""+Math.round(totalProgress * 100) / 100)
    }
    catch (e) {
        console.log(e)
    }
} )

//get total progress of a student
router.post('/getstudenttotalprogress/:studentIndex', async(req,res,next) =>{
    try{
        const index = req.params.studentIndex
        const groupId = req.body.groupId
        const userId = await User.findOne({indexNumber:index}).select('_id');
        // console.log(userId)
        const tasks = await ProgressTasks.find({studentList:userId._id, groupId:groupId})
        // console.log(tasks)
        let progress = 0;
        let totalWeight = 0;
        for(let i in tasks){
            let index = -1;
            for(let j in tasks[i].studentList){ //get the array index of student
                if(tasks[i].studentList[j] == userId._id){
                    index = userId._id
                    let individualProgress = tasks[i].studentProgress[j]; // individual progress of the student
                    let taskTotalProgress = tasks[i].totalProgress; // task total progress
                    let individualContribution = individualProgress * tasks[i].taskWeight ;  // calculating individual contribution
                    // let individualContribution = individualProgress*taskTotalProgress/100.00 * tasks[i].taskWeight ;  // calculating individual contribution
                    progress = progress + individualContribution;
                    totalWeight = totalWeight + tasks[i].taskWeight;
                }
            }
        }
        let studentProgress = progress/totalWeight;
        res.send(""+studentProgress);
    }
    catch (e) {
        console.log(e)
    }
} )

//get task progress of a student
router.post('/getstudenttaskprogress/:studentIndex', async(req,res,next) =>{
    try{
        const index = req.params.studentIndex
        const taskId = req.body.taskId
        const userId = await User.findOne({indexNumber:index}).select('_id');
        const task = await ProgressTasks.findOne({studentList:userId._id,_id:taskId})
        let studentProgress = 0;
        for(let j in task.studentList){ //get the array index of student
            if(task.studentList[j] == userId._id){
                studentProgress = task.studentProgress[j]; // individual progress of the student
            }
        }
        res.send(""+studentProgress);
    }
    catch (e) {
        console.log(e)
    }
} )

module.exports = router;