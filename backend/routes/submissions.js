const express = require("express");
const router = express.Router();
const Submission = require("../models/submissions");
const verify = require("../authentication");
const multer = require("multer");
var path = require("path");
var fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "local_storage/project_submissions/"); //user profile pictures saving destination folder
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

    cb(null, "PROJECT_SUBMISSION -" + time + file.originalname); //set the file neme
  },
});

const upload = multer({ storage: storage }).single("submissionFile");

router.post("/add", async (req, res) => {
  try {
    upload(req, res, async (err) => {
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
        var filePath = "PROJECT_SUBMISSION -" + time + req.file.originalname;
      }

      const existing = await Submission.findOne({
        userId: req.body.userId,
        submissionId: req.body.submissionId,
      });
      if (!existing) {
        const newSubmission = new Submission({
          date: req.body.date,
          userId: req.body.userId,
          projectId: req.body.projectId,
          submissionId: req.body.submissionId,
          groupId: req.body.groupId,
          date_ob: req.body.date_ob,
          files: filePath,
          originalFileName: req.file.originalname,
          groupno: req.body.groupno,
          groupname: req.body.groupname,
          groupmember: req.body.groupmember,
        });
        newSubmission
          .save()
          .then((resulst) => {
            res.json({ state: true, msg: "Data inserted successful.." });
          })
          .catch((err) => {
            res.json({ state: false, msg: "Data inserted unsuccessful.." });
            console.log(err);
          });
      } else {
        Submission.find({
          userId: req.body.userId,
          submissionId: req.body.submissionId,
        })
          .updateOne({
            $push: {
              files: filePath,
            },
          })
          .exec()
          .then((resulst) => {
            res.json({ state: true, msg: "Data inserted successful.." });
          })
          .catch((err) => {
            res.json({ state: false, msg: "Data inserted unsuccessful.." });
            console.log(err);
          });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/submissionFile/:filename", function (req, res) {
  const filename = req.params.filename;

  //console.log("Ashan",filename)
  res.sendFile(
    path.join(__dirname, "../local_storage/project_submissions/" + filename)
  );
});

router.post("/getSubmission", async (req, res) => {
  const projectId = req.body.projectId;
  const submissionId = req.body.submissionId;
  //console.log(req.body)
  Submission.find({ projectId: projectId, submissionId: submissionId })
    .exec()
    .then((data) => {
      res.json({ state: true, data: data, msg: "Data successfully sent..!" });
    })
    .catch((err) => {
      res.send({ state: false, msg: err.message });
    });
});
router.post("/get", async (req, res) => {
  const projectId = req.body.projectId;
  const submissionId = req.body.submissionId;
  const groupId = req.body.groupId;
  // console.log("Ashan",req.body)
  Submission.find({
    projectId: projectId,
    submissionId: submissionId,
    groupId: groupId,
  })
    .exec()
    .then((data) => {
      res.json({ state: true, data: data, msg: "Data successfully sent..!" });
    })
    .catch((err) => {
      res.send({ state: false, msg: err.message });
    });
});

module.exports = router;
