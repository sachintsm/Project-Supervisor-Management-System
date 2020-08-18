const express = require("express");
const router = express.Router();

const submissions = require("../models/submissions");

const verify = require('../authentication');


router.post("/addSubmission" ,verify, async  (req, res) => {
    // console.log("Ashan3")
     try {

          const newSubmission = new submissions({
               userId : req.body.userId,
               projectId : req.body.projectId,
               submissionId : req.body.submissionId,
              // name : req.body.name
          })

          newSubmission
          .save()
          .then((result) =>{
               res.json({state: true, msg: "Data inserted successful.." })
          // console.log(resulst)
          }).catch((err)=>{
               res.json({state:false , msg:"Unsuccessfully Added.."})
               console.log(err)
          })
          
     } catch (error) {
          console.lgo(error)
     }



})

module.exports = router;
