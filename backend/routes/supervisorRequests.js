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

        console.log(personalLimit+"-"+currentLimit)

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


module.exports = router;