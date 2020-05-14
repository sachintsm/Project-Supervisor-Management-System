const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Staff = require('../models/staff');
const UserSession = require('../models/userSession');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verify = require('../authentication');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'local_storage/profile_Images/'); //user profile pictures saving destination folder
  },
  filename: function (req, file, cb) {
    let ts = Date.now();
    let date_ob = new Date(ts);
    const time =
      date_ob.getDate() +
      date_ob.getMonth() +
      1 +
      date_ob.getFullYear() +
      date_ob.getHours();
    cb(null, time + '-' + file.originalname); //set the file neme
  },
});

const upload = multer({ storage: storage }).single('profileImage');

//authentication token verification
router.get('/verify', verify, function (req, res, next) {
  res.send({ state: true, msg: 'Successful..!' });
});

//User registration
router.post("/register", verify, async function (req, res) {
  upload(req, res, (err) = async () => {
    // console.log(req.body)
    // checking if the userId is already in the database
    const userEmailExists = await User.findOne({ email: req.body.email });
    if (userEmailExists) return res.json({ state: false, msg: "This userId already in use..!" })

    //check file empty
    if (req.file == null) return res.json({ state: false, msg: "Profile Image is empty..!" })

    var student
    var admin
    var staff
    if (req.body.userType === 'Admin') {
      admin = true
      student = false
      staff = false
    }
    else if (req.body.userType === 'Staff') {
      staff = true
      admin = false
      student = false
    }
    else if (req.body.userType === 'Student') {
      student = true
      staff = false
      admin = false
    }

    let ts = Date.now();
    let date_ob = new Date(ts);
    const time = date_ob.getDate() + date_ob.getMonth() + 1 + date_ob.getFullYear() + date_ob.getHours()

    var fullPath = time + '-' + req.file.originalname;

    //create a new user
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: req.body.password.toLowerCase(),
      birthday: req.body.birthday,
      nic: req.body.nic.toLowerCase(),
      mobile: req.body.mobileNumber,
      indexNumber: req.body.indexNumber.toLowerCase(),
      regNumber: req.body.regNumber.toLowerCase(),
      imageName: fullPath,
      isStudent: student,
      isAdmin: admin,
      isStaff: staff,
      isSupervisor: false,
      isCoordinator: false,
      isDeleted: false,
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
                    msg: "User Registered Successfully..!",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    state: false,
                    msg: "User Registration Unsuccessfull..!",
                  });
                });
            }
          });
        }
      }
    );
  })
});

router.post('/bulkRegister', async (req, res, next) => {

  var student
  var admin
  var staff

  if (req.body.userType === 'Admin') {
    admin = true
    student = false
    staff = false
  }
  else if (req.body.userType === 'Staff') {
    staff = true
    admin = false
    student = false
  }
  else if (req.body.userType === 'Student') {
    student = true
    staff = false
    admin = false
  }
  //create a new user
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email.toLowerCase(),
    password: req.body.password.toLowerCase(),
    birthday: req.body.birthday,
    nic: req.body.nic.toLowerCase(),
    mobile: req.body.mobileNumber,
    indexNumber: req.body.indexNumber.toLowerCase(),
    regNumber: req.body.regNumber.toLowerCase(),
    imageName: '',
    isStudent: student,
    isAdmin: admin,
    isStaff: staff,
    isSupervisor: false,
    isCoordinator: false,
    isDeleted: false,
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
                  msg: "User Registered Successfully..!",
                });
              })
              .catch((err) => {
                console.log(err);
                res.json({
                  state: false,
                  msg: "User Registration Unsuccessfull..!",
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
  console.log(req.body)
  //checking if the userId is already in the database
  const user = await User.findOne({ email: req.body.email, isDeleted: false });
  if (!user)
    return res
      .status(400)
      .send({ state: false, Error: "This is not valid user!" });

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


router.get('/stafflist/:id', async (req, res, next) => {
  try {
    const results = await Staff.find({ isStudent: false, isDeleted: false, _id: req.params.id });
    res.send(results[0]);
  } catch (error) {
    console.log(error);
  }
});

//get all users details
router.get('/get', function (req, res) {

  User.find()
    .exec()
    .then(result => {
      res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
    })
    .catch(error => {
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})

//delete product
router.delete('/deleteUser/:id', function (req, res) {
  const _id = req.params.id

  User.remove({ _id: _id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Deleted Successfully'
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
})

//get User name
router.get('/getUserName/:id', async (req, res) => {
  const id = req.params.id;

  User
    .find({ _id: id })
    .select('firstName lastName')
    .exec()
    .then(result => {
      res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
    })
    .catch(error => {
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })

})



module.exports = router;
