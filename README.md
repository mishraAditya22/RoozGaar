
# RoozGaar

It's a web-application that can be used as an Job Portal for Recruiters,Job-Seekers with different control options for Admin,Recruiter and JobSeeker.


## Deployment

To use this project on browser

```bash
  https://roozgaar.onrender.com/
```


## Run Locally

Clone the project

```bash
  git clone git@github.com:mishraAditya22/RoozGaar.git
```

Go to the project directory

```bash
  git checkout Release_v2
  cd RoozGaar
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js 
  or
  nodemon server.js
  or 
  npm start 
```


## Features

- Three Users - ADMIN , RECRUITER , JOB-SEEKER
- Login & Signup Functionality as Recruiter , Job-Seeker and Admin
- 1 ADMIN : -
    - 1.a ] Can Approve Recruiters Profile for letting only Genuine Recruiters register for the Application 
    - 1.b ] Can Approve and Delete Posted Jobs on the Platform anytime
    - 1.c ] Admin Friendly Dashboard
    - 1.c ] List of Jobs and Hired Candidates Details
    - 1.d ] Can Change their profile Details
- 2 Recruiter : -
    - 2.a ] Make their and their company profile
    - 2.b ] Post Jobs with Details like : -
        - Job Role
        - Job Description
        - Employment Type
        - Terms and Conditions 
        - Pre-screening Questions
        - No of Openings , etc
    - 2.c ] View Details of Candidates that applied to the Job
    - 2.d ] contact to them and hire them
    - 2.e ] Share Job Profile/Posting

- 3 Job-Seekers : -
    - 3.a ] Update Their Profile 
    - 3.b ] Update their Resumes 
    - 3.c ] Search for Jobs according to filters
    - 3.d ] See list of job , where they applied before
    - 3.e ] while applying the job :- 
        - Read about Terms & Conditions
        - Share the Job 
        - answer the prescreening round questions 



## Tech Stack

**Client:** 
- EJS
- HTML
- CSS
- JAVASCRIPT

**Server:**
- Node.js
- Express.js
- Mongoose
- MongoDB
- CORS
- Bycpt 
- Passport.js
- Sessions
- Flash Api
- javascript 
- .ENV

## Authors

- [@Aditya_Mishra](https://github.com/mishraAditya22)

