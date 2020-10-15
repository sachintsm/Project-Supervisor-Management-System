const express = require("express");
const router = express.Router();
const Notice = require("../models/notice");
const Projects = require('../models/projects');
const createGroups = require("../models/createGroups");
const User = require('../models/users');

const multer = require("multer");
var path = require("path");
const fs = require("fs");
const verify = require('../authentication');
const notice = require("../models/notice");


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


    // if (
    //   !(req.body.toCordinator || req.body.toSupervisor || req.body.toStudent)
    // ) {
    //   req.body.toViewType = false;
    // }

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
        time: req.body.time,
        filePath: filePath,
        //toViewType: req.body.toViewType,
        toCordinator: req.body.toCordinator,
        toSupervisor: req.body.toSupervisor,
        toStudent: req.body.toStudent,
      });

      newNotice
        .save()
        .then((result) => {
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

// all notice get from database without filter
router.get("/viewNotice", (req, res, next) => {

  Notice.find()
    .sort({date:-1 }&&{time:-1})
    .select("noticeTittle notice date time filePath userType toCordinator toStudent toSupervisor projectId userId ")
    .exec()
    .then((docs) => {
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
  res.sendFile(
    path.join(__dirname, "../local_storage/notice_Attachment/" + filename)
  );
});

//delte notice from database
router.delete("/delteNotice/:_id", verify, async (req, res) => {
  const id = req.params._id;

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

//when admin create notice it notice must show only him so get those notices this rout

router.get('/NoticeView/:userId', (req, res) => {
  const userId = req.params.userId;
  Notice
    .find({ userId: userId })
    .sort({date:-1 }&&{time:-1})
    .then(data => {
      res.send({ state: true, data:data, msg: 'Data Transfer Success..!' })
    })
    .catch(err => {
      res.send({ state: false, msg: err.message })
      console.log(err)
    })
})


// only get project id true notices
router.get('/getNotice/:id', async (req, res) => {
  try {
    const coId = req.params.id
    const result1 = await Projects.find({ coordinatorList: coId, projectState: true }).select('_id')
    let idList = []
    for (let i in result1) {
      idList.push(result1[i]._id)
    }

    const result2 = await Notice.find({ projectId: idList })
    .sort({date:-1 }&&{time:-1})
   .then(data => {
    res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
  })

  } catch (error) {
    console.log(error)
    res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" })
  }
})

//acoordinator publish notice it delete  can him that notice get this function
router.get('/cogetNotice/:id', async (req, res) => {
  try {
    const coId = req.params.id
    const result1 = await Projects.find({ coordinatorList: coId, projectState: true }).select('_id')
    let idList = []
    for (let i in result1) {
      idList.push(result1[i]._id)
    }

    const result2 = await Notice.find({ projectId: idList , userId :coId})
    .sort({date:-1 }&&{time:-1})
   .then(data => {
    res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
  })

  } catch (error) {
    console.log(error)
    res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" })
  }
})


// get project name from project collection
router.get('/getProjectName/:id', async (req, res) => {
  const poId = req.params.id
  await Projects
    .find({ _id: poId,  projectState: true })
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Transfered Successfully..!", data: data[0] });
    })
    .catch(error => {
      console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})

// get admin published notices
router.get("/getAdminNotice", (req, res, next) => {

  Notice.find({userType :'admin'})
    .sort({date:-1 }&&{time:-1})
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

//get notice by student 
 
router.get("/getNoticeByStudent/:id" , async (req,res)=>{

  try {
    const sId = req.params.id
    const result1 = await User.findOne({_id:sId , isStudent :true}).select('indexNumber')
   

    const result2 = await createGroups.find({groupMembers : result1.indexNumber , groupState:true}).select('projectId')
    let idList = []
    for(let i in result2){
      idList.push(result2[i].projectId)
    }

    const result3 = await Notice.find({ projectId: idList })
    .sort({date:-1 }&&{time:-1})
   .then(data => {
    res.json({ state: true, msg: "Data Transfered Successfully..!", data: data });
  })
  } catch (error) {
    console.log(error)
    res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" })
  }

})

module.exports = router;
