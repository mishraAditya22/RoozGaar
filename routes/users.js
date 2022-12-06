const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var multer  = require('multer');
var fs  = require('fs');
const db = require('../config/db').MongoURI;

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//User model
const User = require('../models/User');
const Job = require('../models/job');
const Profile = require('../models/JobSeeker_profile');

//login page 
router.get('/login', (req, res) => {
    res.render('login');
});

//register page
router.get('/register', (req, res) => {
    res.render('register');
});

//register post
router.post('/register', (req, res) => {
    //res.send('hello');
    const { name, email, password, password2 } = req.body;

    let errors = [];

    //setting validations 
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //res.send('hello');

        //validation pass
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //user exists
                    errors.push({ msg: "Email is already registered" });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        permission:'jobseeker',
                        password
                    });

                    const newProfile = new Profile({
                        name,
                        email
                    });
                    newProfile.save()
                    //hash password

                    bcrypt.genSalt(10, (err, salt) =>bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        //set password to hashed
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can login');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }))

                }

            });

    }
});

//login post route
router.post('/login',(req, res, next) => {
    passport.authenticate('local' , {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

// //apply get jobs route
// router.get('/apply', (req, res) => {
//     console.log("apply job get request");
//     Job.find({}, function(err, data) {
//     res.render('apply_job', {
//         user: req.user, email: req.email, jobprofile: data
//     });
// });
// });


//apply job get request
router.get('/apply', (req, res) => {
    console.log("apply job get request");

    Job.aggregate([{
        $lookup: {
                from: "recruiters",
                localField: "email",
                foreignField: "email",
                as: "recruiters_new"
            }
    }], function(err, data) {
        if(req.user==null){
            console.log("page cannot be accessed");
            res.send(404);
        }
        else{
            // console.log(data);
            res.render('apply_job', {
                user: req.user, email: req.email, jobprofile: data
            });
        }   
}); 
});

//applyjob post request
router.post('/applyjob', (req, res) => {
    const { jobid, name, email,applicants,flag,accept_indx,done} = req.body;
    console.log(done);
    // console.log(flag);
    // var q = Job.find({applied_candidates_email: { $in: [email] }}).count();
    //if the user has not accepted the terms and conditions
    // if(accept_indx==="0"){
    //     res.send('Please Accept the terms And Condition ');
    //     console.log("start");
    // }
    //if already applied 
    if(flag == 1){
        console.log("not matched with records");
        // alert("already Applied");
        res.status(500).send('Already Applied for this job');
    }
    else{
        Job.updateOne(
            { _id: jobid },
            { $push: { applied_candidates_name: name,applied_candidates_email: email } }, function(err, res) {
            if (err) throw err;
            console.log("applied for job and 1 document updated");
            
          });
          res.render('appliedsuccess');
    }

      
    });


//jobseeker profile
router.get('/profile',(req, res) => {
    res.render('profile',{
        user: req.user, email: req.email
    });
});


// //get update jobseeker profile
// router.get('/profile', (req, res) => {
//     const { name, email } = req.body
//     console.log("update profile get request");      
//     Profile.findOne({email: req.user.email}, function(err, data) {
//     res.render('users/profile', {
//         user: req.user, email: req.email,jobseekerprofile: data
//     });
// });
// });


//post req update jobseeker profile
router.post('/profile', (req, res) => {
    const { name, email, about, contact, age, dob, gender, nationality, address } = req.body;
    console.log("update profile post request jobseeker");

    Profile.updateOne({email: req.user.email}, { 
        $set: { name: name,
        email: email,
        about: about,
        contact: contact,
        age: age,
        dateofbirth: dob,
        gender: gender,
        nationality: nationality,
        address: address,
        }
    }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        
      });
      res.redirect('/users/profile');
    });


//get view jobseeker profile
router.get('/view_profile', (req, res) => {
    const { name, email } = req.body
    console.log("update profile view get request");   
    const urls = {
        Dynamic : process.env.DOWNLOADURL,
        Static : process.env.STATIC
    };   
    Profile.findOne({email: req.user.email}, function(err, data) {
    res.render('view_profile', {
        user: req.user, email: req.email,jobseekerprofile: data,urls:urls
    });
});
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
      cb(null, `${req.body.email}.pdf` )
    }
  })
const upload = multer({storage: storage}).array('files');

router.post('/upload', function (req, res, next) {
    
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        else{
            res.render('uploadsuccess');
        }
    });
})

router.get('/uploadsuccess',(req, res) => {
    res.render('uploadsuccess');
});

//job search without login
router.post('/jobsearch', (req, res) => {
    var search = req.body.searchbyrole;
    console.log("Search for "+search);
    Job.aggregate([{$match : {
        job_role : {
            $regex: new RegExp(search)
        }
    }},
    {
        $lookup: {
                from: "recruiters",
                localField: "email",
                foreignField: "email",
                as: "recruiters_new"
            }
    }], function(err, data) {
            res.render('welcome', {
                 jobprofile: data
            });
          
}); 
});

//job search with login
router.post('/jobseeker_jobsearch', (req, res) => {
    var search = req.body.searchbyrole;
    console.log("Search for "+search);
    Job.aggregate([{$match : {
        job_role : {
            $regex: new RegExp(search)
        }
    }},
    {
        $lookup: {
                from: "recruiters",
                localField: "email",
                foreignField: "email",
                as: "recruiters_new"
            }
    }], function(err, data) {
            res.render('apply_job', {
                user: req.user, email: req.email,jobprofile: data
            });
          
}); 
});

module.exports = router;