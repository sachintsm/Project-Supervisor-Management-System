const express = require('express');
const router = express.Router();
const verify = require('../authentication');
const Users = require('../models/users');
const Projects = require('../models/projects');
const ProjectLimits = require('../models/setProjectLimit');
const CreateGroups = require('../models/createGroups');
const supervisorRequests = require('../models/supervisorrequests');

// check supervisor limit availability
router.post('/checklimit/', verify, async (req, res, next) => {
    try {
        const userId = req.body.data.userId;
        const projectId = req.body.data.projectId;
        const groupId = req.body.data.groupId

        // Checking for the supervising limit
        const personalLimitResult = await ProjectLimits.findOne({projectId: projectId, supervisorId: userId}).select('noProjects');
        const personalLimit = personalLimitResult.noProjects
        const currentProjectsResult = await CreateGroups.find({projectId:projectId, supervisors: userId})
        const currentLimit = currentProjectsResult.length
        let result1 = false
        if(personalLimit-currentLimit>0){
            result1 = true
        }

        // Checking whether already requested
        const previousRequests = await supervisorRequests.find({supervisorId:userId, groupId:groupId})
        let result2 = false
        if(previousRequests.length>0){
            result2 = true
        }

        res.send({isAvailable:result1, alreadyRequested: result2})
    }
    catch (err) {
        console.log(err)
    }
})


router.get('/getcurrentprojectlist/:id', verify, async (req, res, next) => {
    try{
        const userId = req.params.id;
        const groups = await CreateGroups.find({supervisors: userId})
        let projectIdList = []
        groups.map(item=> {
            if(!projectIdList.includes(item.projectId)){
                projectIdList.push(item.projectId)
            }
        })
        let projectCount = []
        projectIdList.map(id=> {
            let count = 0
            groups.map(group=>{
                if(group.projectId===id){
                    count = count+1;
                }
            })
            projectCount.push(count)
        })
        res.send({projectIdList:projectIdList, projectCount:projectCount})
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/addnewrequest', verify, async (req, res, next) => {
    try{
        const request = new supervisorRequests(req.body)
        request.status = "pending"
        const result = await request.save()
        res.send(result)
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/getavailablesupervisorlist/:groupId', verify, async (req, res, next) => {
    try{
        const groupId = req.params.groupId;
        const allSupervisorList = req.body.data;

        const result1 = await CreateGroups.findOne({groupId: groupId})
        const currentSupervisorList = result1.supervisors
        const availableSupervisorList = allSupervisorList.filter(item=>! currentSupervisorList.includes(item))

        res.send(availableSupervisorList)
    }
    catch (err) {
        console.log(err)
    }
})



module.exports = router;