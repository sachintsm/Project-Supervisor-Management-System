const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const multer = require('multer');
var path = require('path');
const fs = require('fs');


//  notification attachment saving destination folder
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null , 'local_storage/notice_Attachment/')
    },

    // file name create like this
    filename: function (req,file,cb){
        let ts = Date.now();
        let date_ob = new Date(ts);
        const time = date_ob.getDate() + date_ob.getMonth() + 1 + date_ob.getFullYear() + date_ob.getHours() + date_ob.getSeconds()
        cb(null , "NOTICE_FILE -" + time + file.originalname)
    }
});


const upload = multer({storage : storage}).single('noticeAttachment');


// data send to database and save
router.post("/addNotice" , (req,res)=>{

    upload(req,res,(err)=>{
        let ts = Date.now();
        let date_ob = new Date(ts);
        const time = date_ob.getDate() + date_ob.getMonth() + 1 + date_ob.getFullYear() + date_ob.getHours() +date_ob.getSeconds()
    if(req.file){
        var filePath = "NOTICE_FILE - "+ time + req.file.originalname; 
    }

    const newNotice = new Notice ({
        noticeTittle : req.body.noticeTittle,
        notice : req.body.notice,
        date: req.body.date,
        filePath : filePath
    });

    newNotice.save()
        .then(result=>{
            console.log(result)
            res.json({state:true, msg:"Data inserted successful.."})
        })
        .catch(error=>{
            res.json({state:false , msg: "Data inserting Unsuccessfull.."} )
        })

    })
});


router.get("/viewNotice", (req, res, next) => { // notice get methord
    Notice.find().sort({ date: -1 })
        .select('noticeTittle notice date filePath') 
        .exec()
        .then(docs => {  // result hadling
            console.log("Data Transfer Successss.!");
            res.status(200).json(docs);
        })
        .catch(error => { // error hadling
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
}); 
//Get news attchment  
router.get("/noticeAttachment/:filename", function (req, res) {
    const filename = req.params.filename;
    // console.log(filename)
    res.sendFile(path.join(__dirname, '../local_storage/notice_Attachment/' + filename));
});

module.exports = router;


