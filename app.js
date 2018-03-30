const express = require('express');
const keys = require('./config/keys');
const passport = require('passport');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('./config/DB');

const app = express();
// Setting up the MySQL DB




// Setting view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/meetups'));

app.listen(3000, ()=>{
  console.log('Listening on port 3000');
});
