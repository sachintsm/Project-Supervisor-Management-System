const express = require('express');
const router = express.Router();
const verify = require('../authentication');
const Users = require('../models/users');
const Projects = require('../models/projects');
const ProjectLimits = require('../models/setProjectLimit');
const CreateGroups = require('../models/createGroups');

// check supervisor limit availability
router.post('/checklimit/', verify, async (req, res, next) => {
    try {
        const userId = req.body.data.userId;
        const projectId = req.body.data.projectId;
        const personalLimitResult = await ProjectLimits.findOne({projectId: projectId, supervisorId: userId}).select('noProjects');
        const personalLimit = personalLimitResult.noProjects
        const currentProjectsResult = await CreateGroups.find({projectId:projectId, supervisors: userId})
        const currentLimit = currentProjectsResult.length
        let result = false
        if(personalLimit-currentLimit>0){
            result = true
        }
        res.send({isAvailable:result})
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



module.exports = router;