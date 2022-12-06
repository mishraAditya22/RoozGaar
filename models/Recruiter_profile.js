const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    about: {
        type: String,
    },
    contact:{
        type: Number,
        // required: true
    },
    company:{
        type: String,
        // required: true
    },
    company_info:{
        type: String,
        // required: true
    }
});

module.exports  = mongoose.model('Recruiter', UserSchema);