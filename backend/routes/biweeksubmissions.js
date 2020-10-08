const express = require('express');
const router = express.Router();
const verify = require('../authentication');
const Projects = require('../models/projects');
const User = require('../models/users');
const BiweekSubmissions = require('../models/biweeksubmissions');
const CreateGroups = require('../models/createGroups');
const multer = require("multer")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
         cb(null, 'local_storage/biweeklystu_submissions/'); //user profile pictures saving destination folder
    },
    filename: function (req, file, cb) {
         let ts = Date.now();
         let date_ob = new Date(ts);
         const time =
              date_ob.getDate() +
              date_ob.getMonth() +
              1 +
              date_ob.getFullYear() +
              date_ob.getHours() +
              date_ob.getMinutes();

         cb(null, 'PROJECT_BI_SUBMISSION -' + time + file.originalname); //set the file neme
    },
});

const upload = multer({ storage: storage }).single('missionsFilesub');
router.post("/add", async (req, res) => {

    try {
         upload(req, res, async (err,) => {
              let ts = Date.now();
              let date_ob = new Date(ts);
              const time =
                   date_ob.getDate() +
                   date_ob.getMonth() +
                   1 +
                   date_ob.getFullYear() +
                   date_ob.getHours() +
                   date_ob.getMinutes();
              if (req.file) {
                   var filePath = "PROJECT_BI_SUBMISSION -" + time + req.file.originalname;
              }
              console.log(filePath)


              const existing = await BiweekSubmissions.findOne({ userId: req.body.userId, submissionId: req.body.submissionId });
              if (!existing) {

               
                   const newSubmission = new BiweekSubmissions({
                        date: req.body.date,
                        time: req.body.time,
                        userId: req.body.userId,
                        projectId: req.body.projectId,
                        biweeklyId: req.body.biweeklyId,
                        groupId:req.body.groupId,
                        date_ob: req.body.date_ob,
                        files: filePath,
                       
                   })
                   newSubmission
                        .save()
                        .then((resulst) => {
                             res.json({ state: true, msg: "Data inserted successful.." });
                        })
                        .catch((err) => {
                             res.json({ state: false, msg: "Data inserted unsuccessful.." })
                             console.log(err)
                        })
              }
              else {
                BiweekSubmissions
                        .find({ userId: req.body.userId, submissionId: req.body.submissionId })
                        .updateOne(
                             {
                                  $push: {
                                       files: filePath
                                  }
                             }
                        )
                        .exec()
                        .then((resulst) => {
                             res.json({ state: true, msg: "Data inserted successful.." });
                        })
                        .catch((err) => {
                             res.json({ state: false, msg: "Data inserted unsuccessful.." })
                             console.log(err)
                        })

              }
         })

    } catch (err) {
         console.log(err);
    }
})

//get biweek submissions by supervisorId
router.get("/getsubmissions/:id",async(req,res) => {
    try{
        const userId = req.params.id
        const groups = await CreateGroups.find({supervisors: userId, groupState: true}).select("_id")
        let groupIdList = []
        groups.map(item => {
            groupIdList.push(item._id)
        })

        const allSubmissions = await BiweekSubmissions.find({groupId: groupIdList, supervisors: userId})

        let result = []

        allSubmissions.map(item=>{
            for (index in item.supervisors){
                if(item.supervisors[index]===userId){
                    if(item.status[index]==="Pending"){
                        result.push(item)
                    }
                }
            }

        })
        res.send(result)
    }
    catch(e){
        console.log(e)
    }
})

//update submission request
router.patch("/updateRequest/:reqId", async (req, res, next) => {
    try {
        const id = req.params.reqId;
        const update = req.body;
        const result = await BiweekSubmissions.findByIdAndUpdate(id, update, { new: true })
        res.send(result)
    } catch (err) {
        console.log(err)
    }
})

router.post('/getBiweekly', async (req, res) => {
     const projectId = req.body.projectId
     const submissionId = req.body.submissionId
     console.log(req.body)
     BiweekSubmissions
          .find({ projectId: projectId, submissionId : submissionId })
          .exec()
          .then(data => {
               res.json({ state: true, data: data, msg: 'Data successfully sent..!' })
          })
          .catch(err => {
               res.send({ state: false, msg: err.message })
          })
})



module.exports = router;