const express = require('express');
const router = express.Router();
const Request = require('../models/request');
//post new request
router.post('/add', (req, res)=> {
      //create a new request
      console.log(' hi');
      console.log(req.body);
      const newReq = new Request({
        supId: req.body.sup_id,
        stuId: req.body.stu_id,
      });
      if(err){
        throw err;
      }
      else {
        newReq
          .save()
          .then((res) => {
            res.json({
              state: true,
              msg: " Successfully..!",
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              state: false,
              msg: " Unsuccessfull..!",
            });
          });
      }
    
  });

  module.exports = router;