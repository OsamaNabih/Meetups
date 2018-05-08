const express = require('express');
//const keys = require('./config/keys');
const passport = require('passport');
const http = require('http');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const passportUser = passport.authenticate('user-local', { session: false })
const mainPageController = require('./controllers/MainPage');
require('./config/DB');

const app = express();

// Setting view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser())

// Routes
app.use('/users', require('./routes/users'));
app.use('/meetup', require('./routes/meetup'));
app.use('/meetups', require('./routes/meetups'));



app.get('/', (req, res) =>{
  let result = mainPageController.GetMainPageStats();
  req.result = result;
  if(req.cookies.jwt === undefined){
    res.render('MainPage', {result: result, userType: 0});
  }
  }, passportUser, (req, res)=>{
    req.result.then((result)=>{
      res.render('MainPage', {result: result, userType: req.user.userType});
    });
});

app.listen(3000,()=>
{
  console.log("Listening on port 3000");
});
