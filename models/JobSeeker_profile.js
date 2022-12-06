const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    about:{
      type: String,
    },
    contact:{
        type: Number,
    },
    age:{
        type: Number,
    },
    dateofbirth: {
        type: Date
      },
      gender: {
        type: String
      },
      nationality: {
        type: String
      },
      address: {
        type: String
      },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports  = mongoose.model('JobSeeker', UserSchema);