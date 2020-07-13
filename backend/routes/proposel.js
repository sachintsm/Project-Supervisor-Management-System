const express = require("express");
const router = express.Router();

const proposel = require("../models/Proposel");

const multer = require("multer");
var path = require("path");
const fs = require("fs");
const verify = require('../authentication');

var storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, "local_storage/proposel_Attachment/");
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
       cb(null, "PROPOSEL_FILE -" + time + file.originalname);
     },
   });
   
   const upload = multer({ storage: storage }).single("proposelAttachment");
   
   router.post("/addProposel", verify, async (req, res) => {

    try {

      req.body.isclose = false;
      req.body.ispending = false;
      req.body.isclose = false;
  

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
            var filePath = "PROPOSEL_FILE -" + time + req.file.originalname;
          }
   })

   const newProposel = new proposel({
        projectId : req.body.projectId,
        proposelTittle : req.body.proposelTittle,
        deadDate : req.body.deadDate,
        deadTime : req.body.deadTime,
        filePath : filePath,
        isopen : req.body.isopen,
        ispending : req.body.ispending,
        isclose : req.body.isclose,

   })

   newProposel
   .save()
   .then((resulst) =>{
     res.json({ state: true, msg: "Data inserted successful.." });
     console.log(resulst)

   })
   .catch((err) =>{
        res.json({state : false , msg : "Data inserted unsuccessful.."})
        console.log(err)
   })

  }catch(err){
    console.log(err);  
  }

})

module.exports = router;