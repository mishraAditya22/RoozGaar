require('dotenv').config();
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const User = require('../models/User.js');
const Job = require('../models/job');
const Profile = require('../models/Recruiter_profile');
const SeekerProfile = require('../models/JobSeeker_profile');
const mongoose = require("mongoose");


function authRole() {
    return (req, res, next) => {
      if (req.user.isAdmin==false) {
        if (req.user.permission=='jobseeker') {
          return Job.aggregate([
            {$match:{applied_candidates_email: req.user.email}},
                {
                    $lookup: {
                    from: "recruiters",
                    localField: "email",
                    foreignField: "email",
                    as: "jobseeker_new"
                }
        }], function(err, data) {
        res.render('dashboard', {
            user: req.user, email: req.email, jobprofile: data
        });
    });
        }
        else if (req.user.permission=='recruiter') {
          console.log("recruiter dashboard");
          return Job.aggregate([
            {$match:{email: req.user.email}},
                {
                    $lookup: {
                    from: "recruiters",
                    localField: "email",
                    foreignField: "email",
                    as: "recruiters_new"
                }
        }], function(err, data) {
        res.render('recruiter/dashboard_recruiter', {
            user: req.user, email: req.email, jobprofile: data
        });
    });
        }
        // else if (req.user.permission=='recruiter') {
        //   console.log("job details and recruiter dashboard");
        //   return res.render('recruiter/dashboard_recruiter', {
        //       user: req.user, email: req.email
        //   })
        // }
      }
  
      next()
    }
  }


//home page
router.get('/', (req, res) => {
    var search = {};
    console.log("Search for "+search);
    Job.aggregate([{$match : {
        // job_role : search
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
// router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/dashboard', authRole(), (req, res) =>
    res.render('admin/dashboard_admin',{
        user: req.user, email: req.email
    })
);

router.get('/about', ensureAuthenticated, (req, res) =>
    res.render('about', {
        user: req.user, email: req.email
    })
);

//get view of all recruiter profile
router.get('/recruiters', authRole(), (req, res) => {
    const { name, email } = req.body     
    Profile.find(function(err, data) {
    res.render('admin/recruiters', {
        user: req.user, email: req.email,recruiterprofile: data
    });
});
});

//get view of all jobseekers profile
router.get('/jobseekers', authRole(), (req, res) => {
    const { name, email } = req.body     
    SeekerProfile.find(function(err, data) {
    res.render('admin/jobseekers', {
        user: req.user, email: req.email,seekerprofile: data
    });
});
});

//get view of all job profiles
router.get('/jobs', authRole(), (req, res) => {
    const { name, email } = req.body     
    Job.aggregate([
    {
        $lookup: {
                from: "recruiters",
                localField: "email",
                foreignField: "email",
                as: "recruiters_new"
            }
    }], function(err, data) {
            res.render('admin/jobs', {
                user: req.user, email: req.email,jobprofile: data
            });
          
}); 
});


// router.post('/view_applicants',async(req,res)=>{
//     try{
//         var Details = [];
//         const foundItem = await Job.find({_id:req.body.jobid});
//         if(foundItem){
//             await foundItem[0].applied_candidates_email.map(async(emailId,idx)=>{
//                 let Result = await SeekerProfile.findOne({email:emailId});
//                 if(Result){
//                     Details.push(Result);
//                     console.log(Details);                   
//                 } 
//                 else{
//                     console.log("error");
//                 }
//             });
//             console.log(Details);
//             res.render('admin/job_desc',{
//                 user: req.user, email: req.email,applicantsDetails:foundItem,
//                 Detail : Details
//             });
//         }
//         if(err)
//             console.log("Data Not Found !!");
//     }
//     catch(err){
//         console.log(err);
//     }
// })


router.post('/view_applicants_details',authRole(),async(req,res)=>{
    let mails = new Set();
    const urls = {
        Dynamic : process.env.DOWNLOADURL,
        Static : process.env.STATIC
    };   
    try{
        const foundItem = await Job.find({_id:req.body.jobid});
        console.log(foundItem[0]);
        if(foundItem){
            foundItem[0].applied_candidates_email.map((email)=>{
                mails.add(email);
            });
            const Data = await SeekerProfile.find({});
            res.render('admin/job_desc',{
                user: req.user, email: req.email,job_role:foundItem[0].job_role,
                Detail : Data, mail:mails ,urls : urls
            });
        }
        else{
            res.status(500).send("Data Not Found");
        }
    }
    catch(err){
        console.log(err);
    }
})


//delete job
router.post('/deletejob', (req, res) => {
    var jobid = req.body.jobid
    console.log("post job delete request : "+jobid);
    Job.deleteOne({_id : jobid}, function(err, data) {
        res.redirect('/jobs');
});
});


//delete recruiter data
router.post('/delete_recruiter',authRole(), async (req, res) => {
    var email = req.body.r_email;
    console.log("recruiter delete request : "+email);
    await Profile.deleteOne({email : email});
await User.deleteOne({email : email});
await Job.deleteOne({email : email}, function(err, data) {
    res.redirect('/recruiters');
});
});

//delete jobseeker
router.post('/delete_jobseekers',authRole(), async (req, res) => {
    var email = req.body.s_email;
    console.log("jobseeker delete request : "+email);
    await SeekerProfile.deleteOne({email : email});
await User.deleteOne({email : email}, function(err, data) {
    res.redirect('/jobseekers');
});
});

//approve job that is posted
router.post('/approvejob', (req, res) => {
    console.log("Approving job"+req.body.jobid);
    Job.updateOne({_id: req.body.jobid}, { 
        $set: { approve: true
        }
    }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        
      });
      res.redirect('/jobs');
    });


module.exports = router;