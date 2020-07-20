var nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

router.post('/sendmail', async (req, res) => {

  console.log(req.body);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '3rdyeargroupproject0@gmail.com',
      pass: 'ucsc@123'
    },
    tls: {
      rejectUnauthorized: false,
    }
  });

  var mailOptions = {
    from: '3rdyeargroupproject0@gmail.com',
    to: req.body.to,
    subject: req.body.subject,
    html: req.body.content
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send({ state: false, message: error })
    } else {
      res.send({ state: true, message: 'Email Send!' })
    }
  });
})

module.exports = router;