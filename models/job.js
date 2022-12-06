const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    job_role:{
        type:String,
        required: true,
    },
    job_desc:{
        type:String,
        required: true,
    },
    openings:{
        type: Number,
        required: true,
    },
    qualifications:{
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    duration:{
        type: String,
        required: true,
    },
    approve:{
        type: Boolean,
    },
    hired:{
        type: Array,
    },
    applied_candidates_name:{
        type: Array,
    },
    applied_candidates_email:{
        type: Array,
    },
    work_role : {
        type : String ,
        required : true
    },
    has_terms : {
        type : String ,
        require : true
    },
    termsAndCondition : {
        type : String
    }
    ,
    user:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		}
    ],
    jobseeker:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Jobseeker"
		}
	],
});

module.exports  = mongoose.model('Job', UserSchema);