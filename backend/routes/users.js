const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Staff = require('../models/staff');
const UserSession = require('../models/userSession');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verify = require('../authentication');

//User registration
router.post('/register', async function (req, res) {
  //checking if the userId is already in the database
  const userEmailExists = await User.findOne({ email: req.body.email });
  if (userEmailExists)
    return res
      .status(400)
      .send({ state: false, msg: 'This userId already in use..!' });

  console.log(req.body);

  //create a new user
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    birthday: req.body.birthday,
    nic: req.body.nic,
    mobile: req.body.mobile,
    isDeleted: req.body.isDeleted,
    isSupervisor: req.body.isSupervisor,
    isStudent: req.body.isStudent,
    isAdmin: req.body.isAdmin,
    isCoordinator: req.body.isCoordinator,
  });

  bcrypt.genSalt(
    10,
    await function (err, salt) {
      if (err) {
        console.log(err);
      } else {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          newUser.password = hash;

          if (err) {
            throw err;
          } else {
            newUser
              .save()
              .then((req) => {
                res.json({
                  state: true,
                  msg: 'User Registered Successfully..!',
                });
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  state: false,
                  msg: 'User Registration Unsuccessfull..!',
                });
              });
          }
        });
      }
    }
  );
});

//User Login
router.post('/login', async function (req, res) {
  const password = req.body.password;

  //checking if the userId is already in the database
  const user = await User.findOne({ email: req.body.email, isDeleted: false });
  if (!user)
    return res
      .status(400)
      .send({ state: false, msg: 'This is not valid user!' });

  bcrypt.compare(password, user.password, function (err, match) {
    if (err) throw err;

    if (match) {
      if (err) {
        console.log(err);
        1;
        return res.send({ state: false, msg: 'Error : Server error' });
      } else {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send({
          state: true,
          userId: user._id,
          msg: 'Sign in Successfully..!',
          token: token,
          isStudent: user.isStudent,
          isAdmin: user.isAdmin,
          isSupervisor: user.isSupervisor,
          isCoordinator: user.isCoordinator,
        });
      }
    } else {
      res.json({ state: false, msg: 'Password Incorrect..!' });
    }
  });
});

router.get('/stafflist', async (req, res, next) => {
  try {
    const results = await Staff.find({ isStudent: false, isDeleted: false });
    res.send(results);
  } catch (error) {
    console.log(error);
  }
});

router.get('/verify', verify, function (req, res, next) {
  res.send({ state: true, msg: 'Successful..!' });
});

//testing merge
module.exports = router;
