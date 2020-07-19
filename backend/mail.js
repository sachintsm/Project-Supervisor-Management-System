var nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

router.post('/sendmail', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name : ${req.body.name} </li>
            <li>Email : ${req.body.email}</li>
            <li>Company: ${req.body.company} </li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `; 

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '3rdyeargroupproject0@gmail.com',
          pass: 'ucsc@123'
        },
        tls : { 
            rejectUnauthorized:false,
        }

      });
      
      var mailOptions = {
        from: '3rdyeargroupproject0@gmail.com',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        html : output
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          res.send({ state : true, message : 'Email Send!'})
        }
      });
})

module.exports = router
