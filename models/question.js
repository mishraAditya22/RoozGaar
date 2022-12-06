const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuesSchema = new mongoose.Schema({
    size : {
        type: Number,
        required:true
    },
    job_id : {
        type : String ,
        required : true
    },
    questions : [{type:String}],
});

module.exports  = mongoose.model('Ques', QuesSchema);