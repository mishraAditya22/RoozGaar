const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    permission:{
            type: String,
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    recruiter:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Recruiter"
		}
	],
    job:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Job"
		}
	],
});

module.exports  = mongoose.model('User', UserSchema);