const express = require('express');
const router = express.Router();
const PresentationFeedback = require("../models/presentationFeedback")
const verify = require('../authentication');

//add presentation feedback
router.post('/add', async (req, res, next) => {
    try {
        const project = new PresentationFeedback(req.body);
        const result = await project.save();
        console.log(result)
        res.send(result);
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router
