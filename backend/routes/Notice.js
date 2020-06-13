const express = require("express");
const router = express.Router();
const Notice = require("../models/notice");
const Projects = require('../models/projects');
const multer = require("multer");
var path = require("path");
const fs = require("fs");
const verify = require('../authentication');

//  notification attachment saving destination folder
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "local_storage/notice_Attachment/");
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
    cb(null, "NOTICE_FILE -" + time + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("noticeAttachment");

// Notice data send to database and save
router.post("/addNotice", verify, async (req, res) => {
  try {

    req.body.toCordinator = false;
    req.body.toSupervisor = false;
    req.body.toStudent = false;


    if (
      !(req.body.toCordinator || req.body.toSupervisor || req.body.toStudent)
    ) {
      req.body.toViewType = false;
    }

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
        var filePath = "NOTICE_FILE -" + time + req.file.originalname;
      }

      const newNotice = new Notice({
        userType: req.body.userType,
        userId: req.body.userId,
        projectId: req.body.projectId,
        noticeTittle: req.body.noticeTittle,
        notice: req.body.notice,
        date: req.body.date,
        filePath: filePath,
        toViewType: req.body.toViewType,
        toCordinator: req.body.toCordinator,
        toSupervisor: req.body.toSupervisor,
        toStudent: req.body.toStudent,
      });

      newNotice
        .save()
        .then((result) => {
          console.log(result);
          res.json({ state: true, msg: "Data inserted successful.." });
        })
        .catch((error) => {
          res.json({ state: false, msg: "Data inserting Unsuccessfull.." });
        });
    });
  } catch (err) {
    console.log(err);
  }
});
// notice get from database
router.get("/viewNotice", (req, res, next) => {

  Notice.find()
    .sort({ date: 1 })
    .select("noticeTittle notice date filePath userType toCordinator toStudent toSupervisor projectId userId ")
    .exec()
    .then((docs) => {
      console.log("Data Transfer Successss.!");
      res.status(200).json(docs);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});
//Get notice attchment from database
router.get("/noticeAttachment/:filename", function (req, res) {
  const filename = req.params.filename;
  console.log(filename);
  res.sendFile(
    path.join(__dirname, "../local_storage/notice_Attachment/" + filename)
  );
});

//delte notice feom database
router.delete("/delteNotice/:_id", verify, async (req, res) => {
  const id = req.params._id;
  console.log(req.params._id);

  Notice.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Deleted Successfully..",
      });
    })
    .catch((error) => {
      res.status(500).json({
        massage: "Deleted Unsuccessfull",
      });
    });
});

//FilleAttachment Delete from Localstorage

router.delete("/noticeAttachment/:filename", (req, res) => {
  const filename = req.params.filename;
  console.log(filename);
  const path = "local_storage/notice_Attachment/" + filename;

  try {
    fs.unlinkSync(path);
    res.status(200).json({
      message: "Delete the file successfully..",
    });
  } catch (err) {
    res.status(500).json({
      message: "Delete Unsuccsessfull..",
    });
  }
});

//when cordinator create notice it notice must show only him

router.get('/NoticeView/:coordinatorId', (req, res) => {
  const coordinatorId = req.params.coordinatorId;
  Notice
    .find({ userId: coordinatorId })
    .then(data => {
      console.log(data)
      res.send({ state: true, data: data, msg: 'Data Transfer Success..!' })
    })
    .catch(err => {
      res.send({ state: false, msg: err.message })
      console.log(err)
    })
})



router.get('/getAllActiveProjectId/:id', async (req, res) => {

  try {

    const coId = req.params.id
    const result1 = await Projects.find({ coordinatorList: coId, projectState: true }).select('_id')
    let idList = []
    for (let i in result1) {
      idList.push(result1[i]._id)
    }

    const result2 = await Notice.find({ projectId: idList })
   // console.log(result2)

   .then(data => {
    res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
  })

  } catch (error) {
    console.log(error)
    res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" })
  }
})

// router.get('/getNotice/:id', async (req, res) => {
//   const coId = req.params.id
//   await Notice
//     .find({ projectId: coId, })
//     .select('noticeTittle notice date filePath userType toCordinator toStudent toSupervisor projectId userId')
//     .exec()
//     .then(data => {
//       res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
//     })
//     .catch(error => {
//       console.log(error)
//       res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
//     })
// })


module.exports = router;
