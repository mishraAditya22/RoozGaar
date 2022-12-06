require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();

//passport config
require('./config/passport')(passport);

//db connection
const db = require('./config/db').MongoURI;

//connect to mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology:true })
    .then(() => console.log('Mongodb Connected'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

//Express session
app.use(session({
    secret: 'Secret',
    resave: true,
    saveUninitialized: true,
   
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
app.use( '/Public',express.static( "Public" ) );
app.use('/uploads', express.static('uploads'))

//setting routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/recruiter', require('./routes/recruiter'));
const PORT = process.env.PORT || 5011;
app.listen(PORT, console.log(`server started at ${PORT}`));
