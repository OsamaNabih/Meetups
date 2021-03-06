const express = require('express');
//const keys = require('./config/keys');
const passport = require('passport');
const http = require('http');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
//const passportUser = passport.authenticate('user-local', { session: false })
const mainPageController = require('./controllers/MainPage');
const passportUser = require('./passport').passportUser;


require('./config/DB');

const app = express();
const env = app.get('env')

// Setting view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));
app.use('/Images', express.static('Images'));

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser())

// Routes
app.use('/users', require('./routes/users'));
app.use('/meetup', require('./routes/meetup'));
app.use('/meetups', require('./routes/meetups'));


app.get('/', passportUser, (req, res) =>{
  let result = mainPageController.GetMainPageStats();
  result.then((result)=>{
    res.render('MainPage', {result: result, userType: Boolean(req.user.userType), userId: req.user.userId});
  }).catch((error)=>{
    res.status(400).json(error);
  });

});
if (env === 'production') {
  app.listen(3000,()=>
  {
    console.log("Listening on port 3000");
  });
}


module.exports = app;
