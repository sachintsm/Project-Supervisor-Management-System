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
  // file name create like this
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

  // console.log("file name : " , req.file.originalname)

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
        //file: req.file.originalname,
        toLateSubmision: tolateSub, 
        submssionFileSize: req.body.submssionFileSize*1000000,
        setFileLimit: req.body.setFileLimit,
   })

   newBiweekly
   .save()
   .then((resulst) =>{
     res.json({ state: true, msg: "Data inserted successful.." });
     // console.log(resulst)

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
  res.sendFile(
    path.join(__dirname, "../local_storage/biweekly_Attachment/" + filename)
  );
});

router.get('/getBiweeklyLink/:_id', async (req, res) => {
  projectId = req.params._id
   // console.log(projectId)
  biweekly.find({ projectId: projectId })
    .sort({ date: -1 } && { time: -1 })
    .then(data => {
      res.send({ state: true, data: data, msg: "data transfer successfully.." })
    }).catch(err => {
      res.send({ state: false, msg: 'data transfer unsuccessfully..' })
    })
})

router.delete('/deleteBiweekly/:_id', verify, async (req, res) => {
  const proID = req.params._id;
  biweekly.remove({ _id: proID })
    .then((result) => {
      res.status(200).json({
        message: "Deleted Successfully..",
      });
    }).catch((error) => {
      res.status(500).json({
        message: "Deleted Unsuccessfully..",
      });
    })
})

router.delete("/biweeklyAttachment/:filename", function (req, res) {
  const filename = req.params.filename;
  // console.log('djankv' , filename)
  const path = 'local_storage/biweekly_Attachment/' + filename;
  try {
    fs.unlinkSync(path)
    res.status(200).json({
      message: 'Delete the file successfully..!'
    })
    //file removed
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: 'deleted unsuccessful..'
    });
  }
});

router.post('/updateBiweekly/:_id', (req, res) => {  // update methord 
  const proId = req.params._id;
  ///console.log(proId)
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
          //file: req.file.originalname,
          toLateSubmision: tolateSub, 
          submssionFileSize: req.body.submssionFileSize*1000000,
          setFileLimit: req.body.setFileLimit,

      }
      // console.log("Id",proId);

      biweekly.update({ _id: proId }, { $set: input }
      )
        .exec()
        .then(data => {
         // console.log('Proposel update successe.')
          res.json({ state: true, msg: 'Proposel update success..' });
        })
        .catch(error => {
         // console.log('Proposel update unsuccessfull..')
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
       const biweeklyLinks = await biweekly.find({projectId: projectId})
       let data = biweeklyLinks.length + 1
       res.send({state:true,data:data,msg:"succeded"})
  } catch (error) {
       console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" })
  }
})




module.exports = router;