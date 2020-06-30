const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Staff = require('../models/staff');
const CreateGroups = require('../models/createGroups');
const Img = require('../models/profileImage');
const UserSession = require('../models/userSession');
const Request = require('../models/request');
const Projects = require('../models/projects');
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

//? get Supervisors List
router.get('/supervisorsList', async (req, res) => {
  try {
    const results = await User.find({ isSupervisor: true, isDeleted: false });
    res.send(results);
  } catch (error) {
    console.log(error);
  }
})
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
  User.findById(req.params.id, function (err, user) {
    if (!user) {
      res.status(404).send("data is not found");
    }
    else {
      user.isDeleted = true;

      user.save().then(user => {
        res.send({ state: true, msg: "Successfully deleted!" })
      })
        .catch(err => {
          res.status(400).send({ msg: "Delete not possible", state: false });
        });
    }
  });
});

//admin update user password
router.route('/updatePasswordA/:id').post(function (req, res) {
  console.log('zxcvbn');
  console.log(req.params.id);

  // var newPassword = req.body.nic
  let id = req.params.id;
  User.findById({ _id: id }, function (err, user) {    //find the user with respect to the userid
    console.log(user.nic);

    var newPassword = user.nic

    if (err) throw err;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newPassword, salt, function (err, hash) {   //hash the new password
        newPassword = hash;
        if (err) {
          throw err;
        }
        else {
          User.updateOne({ _id: id }, {   //save the new password to the database
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

//update user profile by admin

router.post('/updateUser/:id', function (req, res) {
  let id = req.params.id;
  User.findById({ _id: id }, function (err, user) {
    if (err)
      res.status(404).send("data is not found");
    else {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.nic = req.body.nic;
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
    fs.unlink(path.join(__dirname, '../local_storage/profile_Images/' + p), function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
      console.log('File deleted!');
    });
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
///// update no of projects

router.post('/academic/:id', function (req, res) {
  let id = req.params.id;
  console.log(id);
  User.findById({ _id: id }, function (err, user) {
    if (err)
      res.status(404).send("data is not found");
    else {
      console.log(req.body.pro);
      user.noProject = req.body.pro;

      user.save().then(user => {
        res.json({ state: true, msg: 'Update Complete', data: user.noProject });

      })
        .catch(err => {
          res.status(400).send("unable to update database");
        });
    }
  });
});
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

//get student index from student userID
router.get('/studentindex/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const index = await User.find({ _id: id }).select('indexNumber');
    res.send(index)
  }
  catch (err) {
    console.log(err)
  }
})


//get all group members by userId of one student
router.post("/getgroupmembers/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const projectId = req.body.projectId;
    const result = await User.findOne({ _id: userId }).select('indexNumber');
    const index = result.indexNumber

    const group = await CreateGroups.findOne({ projectId: projectId, groupMembers: index }).select("groupMembers")
    res.send(group.groupMembers)

  }
  catch (e) {
    console.log(e)
  }
})


////////check supervisor request/////////////////////
router.post('/check', async (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let dateString = new Date(date_ob).toUTCString();
  dateString = dateString.split(' ').slice(0, 4).join(' ');

  console.log(req.body.sup_id);
  console.log(req.body.stu_id);

  const result = await User.findOne({ _id: req.body.stu_id }).select('indexNumber');
  const index = result.indexNumber
  console.log(index);

  const group = await CreateGroups.findOne({ projectId: req.body.project_id, groupMembers: index }).select("groupId")
  console.log(group.groupId);



  Request.find({ groupId: group.groupId }).select().exec()
    .then(data => {
      console.log(data);
      console.log(data.length);
      var count = 0;
      var stat = false;
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].reqDate);
        if (dateString == (data[i].reqDate)) {
          count = count + 1;
        }
      }
      console.log(count);
      if (count < 2) {
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].reqDate);
          if ((group.groupId == (data[i].groupId)) && (req.body.sup_id == (data[i].supId))) {
            stat = true;
          }
          else {
            stat = false;
          }
        }
        if (stat == true) {
          res.json({ state: false, msg: "Your group have already requested..." });
        }
        else {
          res.json({ state: true, msg: "You can request..." });
        }

    }else{
          res.json({ state: false, msg: "You have exceed your  limit. You cannot request anymore today" });
    }

    })
    .catch(err => {
      console.log(err);
      res.json({ state: false, msg: "Request Failed..!" });
    })


})
//////////////////////////request send supervisors//////////////////////////
router.post('/add', async (req, res) => {

  let ts = Date.now();
  let date_ob = new Date(ts);
  let dateString = new Date(date_ob).toUTCString();
  dateString = dateString.split(' ').slice(0, 4).join(' ');

  const result = await User.findOne({ _id: req.body.stu_id }).select('indexNumber');
  const index = result.indexNumber
  console.log(index);

  const group = await CreateGroups.findOne({ projectId: req.body.project_id, groupMembers: index }).select("groupId")
  console.log(group.groupId);

  //create a new request
  const newReq = new Request({
    supId: req.body.sup_id,
    stuId: req.body.stu_id,
    state: 'pending',
    reqDate: dateString,
    groupId: group.groupId,
    projectId: req.body.project_id,
    description: req.body.descript


  });

  newReq.save()
    .then(result => {
      console.log(result)
      res.json({ state: true, msg: "Request Successfull..!" });
    })
    .catch(error => {
      console.log(error)
      res.json({ state: false, msg: "Request Failed..!" });
    })

});

/////get supervisors//////////////////
router.get('/getSup/:id', async (req, res) => {

  const id = req.params.id;

  Projects
    .find({ _id: id })
    .exec()
    .then(data => {

      //console.log(data[0].supervisorList);
      var supervisorIdList = data[0].supervisorList
      // console.log(supervisorIdList.length);
      if (supervisorIdList.length === 0) {
        res.json({ state: false, msg: "No Supervisors!" });
      } else {
        var arr1 = [];
        for (let i = 0; i < supervisorIdList.length; i++) {
          var idS = supervisorIdList[i]
          console.log(idS);
          User.find({ _id: idS })
            .exec()
            .then(result => {
              console.log(result[0]);
              arr1.push(result[0]);

              if (i === (supervisorIdList.length - 1)) {
                console.log(arr1);
                res.json({ state: true, msg: "Data Transfer Successfully..!", data: arr1 });
              }
              else {
                console.log("no");
              }
              //res.json({ state: true, msg: "Data Transfer Successfully..!", data: result });
            })
            .catch(error => {
              res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
            })
        }
        //console.log(arr1);
      }

    })
    .catch(error => {
      console.log(error)
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })

})

//get user by id

router.get('/getUser/:id', async (req, res) => {

  const userid = req.params.id;
  await User.find({ _id: userid })
    .select('firstName lastName')
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Transfer Successfully..!", data: data[0] });
      // console.log("dd",result.data)
    })
    .catch(error => {
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})


//? get  user profile image names
//? (MesasageContainer.js)
router.get('/getUserImage/:id', async (req, res) => {
  const id = req.params.id
  
  User.find({ _id: id })
    .select('imageName')
    .exec()
    .then(data => {
      res.json({ state: true, msg: "Data Transfer Successfully..!", data: data });
    })
    .catch(error => {
      res.json({ state: false, msg: "Data Transfering Unsuccessfull..!" });
    })
})

module.exports = router;
