const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//User model
const Recruiter = require('../models/User');
const Profile = require('../models/Recruiter_profile');
const Job = require('../models/job');
const SeekerProfile = require('../models/JobSeeker_profile');
const job = require('../models/job');
const ques = require('../models/question');
const ans = require('../models/responses');




//register page
router.get('/register', (req, res) => {
    res.render('recruiter/recruiter_register');
});

router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('recruiter/profile', {
        user: req.user, email: req.email
    })
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
        res.render('/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //res.send('hello');

        //validation pass
        Recruiter.findOne({ email: email })
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
                    const newUser = new Recruiter({
                        name,
                        email,
                        permission:'recruiter',
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

router.get('/separateJob/:_id',async(req,res)=>{
    const Domain = req.params._id;
    const Data = await Job.findOne({_id : Domain});
    res.render("recruiter/separate",{jobprofile:Data});
})

//route for job question 
router.post('/saveQues',async(req,res)=>{
    console.log(req.body);
    const Jdata = await Job.findById(req.body.job_id);
    try{
        const questions = await ques.create({
            job_id : req.body.job_id,
            size : req.body.size,
            questions : req.body.quesd
        });
        if(questions)
        res.render('recruiter/post_success');
    } catch(err){
        res.send(err)
        console.log(err);
    }
})


//need to create router to create job
router.get('/postjob', async(req, res) => {
    const { name, email } = req.body
    console.log("post job get request");
    const data = await Job.find({email:req.user.email});
    if(data){
        res.render('recruiter/create_job', {
            user: req.user, email: req.email, jobprofile: data
        });
    }
});


//postjob  post req
router.post('/postjob', async(req, res) => {
    console.log("post job post request");

    const { size,job_role, job_desc, openings, qualifications, duration,deadline, email, work_role, has_terms, termsAndCondition } = req.body;
        
    // const DBdata = await Job.findOne({email: email});
    // if(DBdata){
    const newJob = new Job({
         email,job_role, job_desc, openings, qualifications,duration, deadline, work_role, approve: false , has_terms , termsAndCondition
    });
    const save = await newJob.save();
    if(save){
        // console.log(size);
        if(size>0){
            // console.log(save._id);
            res.render('recruiter/addQues',{user: req.user, email: req.email,job_id : save._id,size:size,job_role : save.job_role});
        }
        else{
            res.render('recruiter/post_success');
        }
    }
        
    // }

        //previous Code 
        // Job.findOne({ email: email })
        //     .then(user => {
        //             const newJob = new Job({
        //                 email,job_role, job_desc, openings, qualifications,duration, deadline, work_role, approve: false , has_terms , termsAndCondition
        //             });

        //                 newJob.save()
        //                     .then(user => {
        //                         // res.redirect('/recruiter/postjob');
        //                         res.render('recruiter/addQues')
        //                         //console.log(`Job Posted by ${email}`);
        //                     })
        //                     .catch(err => console.log(err));
        //     });
    
});

//update Job
router.get("/updatejob/:_id",async(req,res)=>{
    try{
        const data = await job.findById(req.params._id);
        // console.log(data);
        res.render('recruiter/updateJob', {
            user: req.user, email: req.email, jobprofile: data
        });
    } catch(err){
        console.log(`error is ${err}`);
    }
})

router.post("/updatejob/:_id",async(req,res)=>{
    console.log("Update Request");
    try{
        console.log(req.params._id);
        const { job_role , job_desc , openings , qualifications , duration , work_role , deadline , has_terms , termsAndCondition } = req.body;
        const Data = await job.findByIdAndUpdate(req.params._id,{job_role,job_desc,openings,qualifications,duration,work_role,deadline,has_terms,termsAndCondition});
        if(!Data){
            res.status(2003).send("Data not Inserted Properly !");
        }
        res.status(200).render('recruiter/updateJob_sucess');
    } catch(err){
        err.throw(`error while updating job Details ${err}`);
    }
})


//update profile
router.get('/update_profile', (req, res) => {
    const { name, email } = req.body
    console.log("update profile get request");      
    Profile.findOne({email: req.user.email}, function(err, data) {
    res.render('recruiter/update_profile', {
        user: req.user, email: req.email, recruiterprofile: data
    });
});
});

//update recruiter profile
router.post('/update_profile', (req, res) => {
    const { name, email, about, contact, company, company_info } = req.body;
    console.log("update profile post request");

    Profile.updateOne({email: req.user.email}, { 
        $set: { name: name,
        email: email,
        about: about,
        contact: contact,
        company: company,
        company_info: company_info,
        }
    }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        
      });
      res.redirect('/recruiter/update_profile');
    });


//delete job
router.post('/deletejob', (req, res) => {
    var jobid = req.body.jobid
    console.log("post job delete request : "+jobid);
    Job.deleteOne({_id : jobid}, function(err, data) {
        res.redirect('/recruiter/postjob');
});
});

//view applicants profile post request
router.post('/view_applicants', (req, res) => {
    var s_email = req.body.s_email;
    console.log("view applicant form : "+s_email);
    SeekerProfile.findOne(
        {email: s_email},
         function(err, data) {
        res.render('recruiter/view_applicants', {
            user: req.user, email: req.email,jobseekerprofile: data
        });
});
});

//hire appicant
router.post('/hire_applicant', (req, res) => {
    var s_email = req.body.s_email;
    var jobid = req.body.id;
    var flag = req.body.flag;
    if(flag == 1){
        res.status(500).send('Already Hired This Applicant!');
    }
    else{
        console.log("hired applicant : "+s_email);
    Job.updateOne(
        { _id: jobid },
    { $push: { hired: s_email} },
         function(err, data) {
        res.render('recruiter/hired_applicant', {
            user: req.user, email: req.email,jobseekerprofile: data
        });
});

    }
    
});


//view applicants details profile post request
router.post('/candidate_list', (req, res) => {
    var s_email = req.body.s_email;
    const { role } = req.body;
    console.log(role);
    Job.find(
        {job_role: role}, function(err, data) {
    res.render('recruiter/candidate_list', {
        user: req.user, email: req.email, jobprofile: data
    });
});
});

module.exports = router;