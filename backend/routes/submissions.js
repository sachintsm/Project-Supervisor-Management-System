const express = require("express");
const router = express.Router();
const Submission = require("../models/submissions");
const verify = require('../authentication');
const multer = require("multer")
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, 'local_storage/project_submissions/'); //user profile pictures saving destination folder
     },
     filename: function (req, file, cb) {
          let ts = Date.now();
          let date_ob = new Date(ts);
          const time =
               date_ob.getDate() +
               date_ob.getMonth() +
               1 +
               date_ob.getFullYear() +
               date_ob.getHours();
          cb(null, time + '-' + file.originalname); //set the file neme
     },
});

const upload = multer({ storage: storage }).single('submissionFile');


router.post("/add", async (req, res) => {

     const existing = await Submission.findOne({ userId: req.body.userId, submissionId: req.body.submissionId });


     try {
          if (!existing) {
               upload(req, res, (err) => {
                    let ts = Date.now();
                    let date_ob = new Date(ts);
                    const time =
                         date_ob.getDate() +
                         date_ob.getMonth() +
                         1 +
                         date_ob.getFullYear() +
                         date_ob.getHours() +
                         date_ob.getSeconds();
                    if (req.file) {
                         var filePath = "PROJECT_SUBMISSION -" + time + req.file.originalname;
                    }

                    const newSubmission = new Submission({
                         userId: req.body.userId,
                         projectId: req.body.projectId,
                         submissionId: req.body.submissionId,
                         date_ob: req.body.date_ob,
                         fileName: filePath,
                    })
                    console.log(newSubmission);
                    // newProposel
                    //      .save()
                    //      .then((resulst) => {
                    //           res.json({ state: true, msg: "Data inserted successful.." });
                    //           // console.log(resulst)

                    //      })
                    //      .catch((err) => {
                    //           res.json({ state: false, msg: "Data inserted unsuccessful.." })
                    //           console.log(err)
                    //      })
               })
          }
          else {

               upload(req, res, (err) => {
                    console.log("file path : "+ req.file.originalname);
               })
          }
     } catch (err) {
          console.log(err);
     }
})

module.exports = router;
