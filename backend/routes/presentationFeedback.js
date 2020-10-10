const express = require('express');
const router = express.Router();
const PresentationFeedback = require("../models/presentationFeedback")
const verify = require('../authentication');

//add presentation feedback
router.post('/add', async (req, res, next) => {
    try {
        const project = new PresentationFeedback(req.body);
        const result = await project.save();
        res.send(result);
    }
    catch (err) {
        console.log(err)
    }
})

//view all presentation feedback
router.get('/get', async (req, res, next) => {
    try {
        const result = await PresentationFeedback.find();
        res.send(result);
    }
    catch (err) {
        console.log(err)
    }
})

//delete all presentation feedback
router.delete('/delete/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const result = await PresentationFeedback.findOneAndDelete({_id: id});
        res.send(result);
    }
    catch (err) {4
        console.log(err)
    }
})

//edit progresstasks
router.patch('/edit/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const obj = req.body;
        const result = await PresentationFeedback.findByIdAndUpdate(id,  obj,{ new: true })
        res.send(result)
    }
    catch (e) {
        console.log(e)
    }
})

module.exports = router