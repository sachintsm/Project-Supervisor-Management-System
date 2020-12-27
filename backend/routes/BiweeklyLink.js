const express = require("express");
const router = express.Router();

const biweekly = require("../models/BiweeklyLink");

const multer = require("multer");
var path = require("path");
const fs = require("fs");
const verify = require('../authentication');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "local_storage/biweekly_Attachment/");
  },
  // file name is created
  filename: function (req, file, cb) {
    let ts = Date.now();
    let date_ob = new Date(ts);
    const time =
      date_ob.getDate() +
      date_ob.getMonth() +
      1 +
      date_ob.getFullYear() +
      date_ob.getHours() +
      date_ob.getSeconds();
    cb(null, "BIWEEKLY_FILE -" + time + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("biweeklyAttachment");

router.post("/addBiweekly", async (req, res) => {


  try {

    const tolateSub = req.body.toLateSubmision;

    upload(req, res, (err) => {
      let ts = Date.now();
      let date_ob = new Date(ts);
      const time =
        date_ob.getDate() +
        date_ob.getMonth() + 1 +
        date_ob.getFullYear() +
        date_ob.getHours() +
        date_ob.getSeconds();
      if (req.file) {
        var filePath = "BIWEEKLY_FILE -" + time + req.file.originalname;
      }

      const newBiweekly = new biweekly({
        userType: req.body.userType,
        userId: req.body.userId,
        projectId: req.body.projectId,
        date: req.body.date,
        time: req.body.time,
        projectId: req.body.projectId,
        biweeklyNumber: req.body.biweeklyNumber,
        biweeklyDiscription: req.body.biweeklyDiscription,
        deadDate: req.body.deadDate,
        deadTime: req.body.deadTime,
        filePath: filePath,
        isDeleted : 'false',
        toLateSubmision: tolateSub, 
        submssionFileSize: req.body.submssionFileSize*1000000,
        setFileLimit: req.body.setFileLimit,
   })

   newBiweekly
   .save()
   .then((resulst) =>{
     res.json({ state: true, msg: "Data inserted successful.." });
     
   })
   .catch((err) =>{
        res.json({state : false , msg : "Data inserted unsuccessful.."})
        console.log(err)
   })
  })
}catch (err) {
  console.log(err);
}  
})

router.get("/biweeklyAttachment/:filename", function (req, res) {
  const filename = req.params.filename;
  console.log(filename)
  res.sendFile(
    path.join(__dirname, "../local_storage/biweekly_Attachment/" + filename)
  );
});

router.get('/getBiweeklyLink/:_id', async (req, res) => {
  projectId = req.params._id
   biweekly.find({ projectId: projectId , isDeleted:false})
    .sort({ date: -1 } && { time: -1 })
    .then(data => {
      res.send({ state: true, data: data, msg: "data transfer successfully.." })
    }).catch(err => {
      res.send({ state: false, msg: 'data transfer unsuccessfully..' })
    })
})


router.patch("/deleteBiweekly/:_id", async (req, res, next) => {
  
  try {
    const proID = req.params._id;
    console.log(proID)
    const result = await biweekly.findByIdAndUpdate(proID, { isDeleted: true }, { new: true })
    res.send(result)
  } catch (err) {
    console.log(err)
  }
})

// update method
router.post('/updateBiweekly/:_id', (req, res) => {   
  const proId = req.params._id;
  
  try {
    req.body.toLateSubmision = false;

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

      const fillPath = "BIWEEKLY_FILE - " + time + req.file.originalname;
    
      const input = {
          userType: req.body.userType,
          userId: req.body.userId,
          projectId: req.body.projectId,
          date: req.body.date,
          time: req.body.time,
          projectId: req.body.projectId,
          biweeklyNumber: req.body.biweeklyNumber,
          biweeklyDescription: req.body.biweeklyDescription,
          deadDate: req.body.deadDate,
          deadTime: req.body.deadTime,
          filePath: filePath,
          isDeleted:'false',
          toLateSubmision: tolateSub, 
          submssionFileSize: req.body.submssionFileSize*1000000,
          setFileLimit: req.body.setFileLimit,

      }
      
      biweekly.update({ _id: proId }, { $set: input }
      )
        .exec()
        .then(data => {
         // console.log('Proposal update success.')
          res.json({ state: true, msg: 'Proposel update success..' });
        })
        .catch(error => {
         // console.log('Proposal update unsuccessfull..')
          res.json({ state: false, msg: 'Peoposel update unsuccess..' });
        })
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/getBiweeklyNumber/:id',async (req, res) => {
  try {
       const projectId = req.params.id;
       const biweeklyLinks = await biweekly.find({projectId: projectId , isDeleted:false})
       let data = biweeklyLinks.length + 1
       res.send({state:true,data:data,msg:"Data Transfering successfull..!"})
  } catch (error) {
       console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" })
  }
})

module.exports = router;