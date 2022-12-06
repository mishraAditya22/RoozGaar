const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResponseSchema = new mongoose.Schema({
    job_id : {
        type : String ,
        required : true
    },
    answers : [{type:String}],
});

module.exports  = mongoose.model('Response', ResponseSchema);