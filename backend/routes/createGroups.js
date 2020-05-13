const express = require('express');
const router = express.Router();
const CreateGroups = require('../models/createGroups');


// ?create new group
router.post('/', (req,res) => {

})

//? get all the groups on spesific project
router.get('/group/:projectId', (req,res) => {
    const projectId = req.params.projectId

})

module.exports = router