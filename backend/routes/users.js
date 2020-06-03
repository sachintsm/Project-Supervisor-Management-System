const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Staff = require('../models/staff');
const Img = require('../models/profileImage');
const UserSession = require('../models/userSession');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verify = require('../authentication');
const multer = require('multer');
var path = require('path');
var fs = require('fs');

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

//? bulk user registration funtion
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
  console.log('ddddddddddddddddddddddddddddddddddd')
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

//? get student name
router.get('/studentList/:id', async (req, res, next) => {

  try {
    const id = req.params.id;
    User
      .find({ isStudent: true, isDeleted: false, indexNumber: id })
      .select('indexNumber regNumber firstName lastName')
      .exec()
      .then(data => {
        res.json({ state: true, data: data[0], msg: 'Data successfully sent..!' })
      })
      .catch(err => {
        res.send({ state: false, msg: err.message })
      })
  } catch (error) {
    console.log(error);
  }
});

//? get supervisor name
router.get('/supervisorList/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    User
      .find({ isSupervisor: true, isDeleted: false, _id: id })
      .select('firstName lastName')
      .exec()
      .then(data => {
        res.json({ state: true, data: data[0], msg: 'Data successfully sent..!' })
      })
      .catch(err => {
        res.send({ state: false, msg: err.message })
      })
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


//delete user
router.route('/deleteUser/:id').post(function (req, res) {
  console.log('zxcvbn');


  User.findById(req.params.id, function (err, user) {
    if (!user) {
      res.status(404).send("data is not found");
    }
    else
      user.isDeleted = true;

    user.save().then(user => {

    })
      .catch(err => {
        res.status(400).send("Delete not possible");
      });
  });
});

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

//get details to user profile
router.get('/get/:id', function (req, res) {
  let id = req.params.id;
  User.find({ _id: id })
    .exec()
    .then(result => {
      res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
    })
    .catch(error => {
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
});

//update user profile 
router.post('/update/:id', function (req, res) {
  let id = req.params.id;
  User.findById({ _id: id }, function (err, user) {
    if (err)
      res.status(404).send("data is not found");
    else {
      user.email = req.body.email;
      user.mobile = req.body.mobile;

      user.save().then(user => {
        res.json({ state: true, msg: 'Update Complete' });
      })
        .catch(err => {
          res.status(400).send("unable to update database");
        });
    }
  });
});

////////////////get user profile pic
router.get("/profileImage/:filename", function (req, res) {
  console.log(req.params.filename)
  const filename = req.params.filename;
  console.log(filename)
  res.sendFile(path.join(__dirname, '../local_storage/profile_Images/' + filename));

});


////update user profile pic
router.post('/uploadmulter/:id', async function (req, res) {
  let id = req.params.id;
  console.log(id);

  const userIdExists = await User.findOne({ _id: id });
  console.log(userIdExists);
  if (userIdExists) {
    console.log("true")
    var p = userIdExists.imageName;
    console.log(p);
    fs.unlink(path.join(__dirname, '../local_storage/profile_Images/' + p), function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
      console.log('File deleted!');
    });

    upload(req, res, (err) = async () => {
      let ts = Date.now();
      let date_ob = new Date(ts);
      const time = date_ob.getDate() + date_ob.getMonth() + 1 + date_ob.getFullYear() + date_ob.getHours()

      var fullPath = time + '-' + req.file.originalname;
      console.log(fullPath);

      User.findById({ _id: id }, function (err, user) {
        if (err) {
          res.status(404).send("data is not found");
        }
        else {
          user.imageName = fullPath
          user.save()
            .then((req) => {
              res.json({
                state: true,
                msg: "Update profile picture!",
              });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                state: false,
                msg: "Update Unsuccessfull..!",
              });
            });
        }
      })

    })
  }

});

//reset password using profile
router.post('/reset/:id', function (req, res) {
  const oldPassword = req.body.currentPw
  var newPassword = req.body.newPw
  let id = req.params.id;
  User.findById({ _id: id }, function (err, user) {    //find the user with respect to the userid
    if (err) throw err;
    bcrypt.compare(oldPassword, user.password, function (err, match) {  //check the old password with database password
      if (err) {
        throw err;
      }
      if (match) {    //if userid and password mached
        console.log("Userid and Password match...!");
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newPassword, salt, function (err, hash) {   //hash the new password
            newPassword = hash;
            if (err) {
              throw err;
            }
            else {
              User.update({ _id: id }, {   //save the new password to the database
                $set: {
                  password: newPassword
                }
              })
                .exec()
                .then(data => {
                  console.log("Data Update Success..!")
                  res.json({ state: true, msg: "Data Update Success..!" });

                })
                .catch(error => {
                  console.log("Data Updating Unsuccessfull..!")
                  res.json({ state: false, msg: "Data Updating Unsuccessfull..!" });
                })
            }
          });
        });
      }
      else {
        res.json({
          state: false,
          msg: "Password Incorrect..!"
        });
      }
    });
  });
})

//? check student available or not
router.get('/student/:id', verify, async (req, res) => {
  const index = req.params.id;
  const ifExist = await User.findOne({ indexNumber: index });
  if (!ifExist) return res.json({ state: false, msg: "This Index not available..!" })
  else return res.json({ state: true })
})

//? update isSupervisor -> true , when assigne supervisors to the prjectcts
router.get('/updateSupervisor/:id', (req, res) => {
  const id = req.params.id
  User.find({ _id: id })
    .update({ isSupervisor: true })
    .exec()
    .then(data => {
      res.json({ state: true, msg: 'Data successfully updated..!' })
    })
    .catch(err => {
      res.send({ state: false, msg: err.message })
    })
})
module.exports = router;
