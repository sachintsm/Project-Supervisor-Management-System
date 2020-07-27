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
   
  

   router.post("/addProposel", async (req, res) => {

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
          if (req.file) {
            var filePath = "PROPOSEL_FILE -" + time + req.file.originalname;
          }
   

   const newProposel = new proposel({
        projectId : req.body.projectId,
        date: req.body.date,
        time: req.body.time,
        proposelTittle : req.body.proposelTittle,
        proposelDiscription:req.body.proposelDiscription,
        deadDate : req.body.deadDate,
        deadTime : req.body.deadTime,
        filePath : filePath,
        toLateSubmision: req.body.toLateSubmision,
   })

   newProposel
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

router.get("/proposelAttachment/:filename", function (req, res) {
  const filename = req.params.filename;
  res.sendFile(
    path.join(__dirname, "../local_storage/proposel_Attachment/" + filename)
  );
});

router.get('/getSubmisionLink',async (req,res) =>{

  proposel.find()
  .sort({date:-1}&&{time:-1})
  .then(data =>{
    res.send({state:true , data:data , msg:"data transfer successfully.."})
  }).catch(err=>{
    res.send({state:false,msg:'data transfer unsuccessfully..'})
})
})

router.delete('/deleteSubmision/:_id', verify , async (req,res)=>{

  const proID = req.params._id;
  proposel.remove({_id : proID})
  .then((result) =>{
    res.status(200).json({
      message: "Deleted Successfully..",
    });
  }).catch((error)=>{
    res.status(500).json({
      message: "Deleted Unsuccessfully..",
    });
  })

})

//update proposel
router.patch("/:_id", async (req,res)=>{
// console.log("ssssssssssssss")
  try{
    const id = req.params._id;
    console.log(id)
    if(!req.body.toLateSubmision){
      req.body.toLateSubmision = false;
    }

    const updateProposel = new proposel({
      projectId : req.body.projectId,
      date: req.body.date,
      time: req.body.time,
      proposelTittle : req.body.proposelTittle,
      proposelDiscription:req.body.proposelDiscription,
      deadDate : req.body.deadDate,
      deadTime : req.body.deadTime,
     // filePath : filePath,
      toLateSubmision: req.body.toLateSubmision,
 });

 const result = await proposel.findByIdAndUpdate(id , updateProposel , {new:true})
 res.send(result)
  }catch(err){
    console.log(err)
  }
})



module.exports = router;