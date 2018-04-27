const express = require('express');
//const keys = require('./config/keys');
const passport = require('passport');
const http = require('http');
const morgan = require('morgan');
const MeetupController = require('./controllers/meetup');
const bodyParser = require('body-parser');
require('./config/DB');

const app = express();
// Setting up the MySQL DB




// Setting view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'));
app.use('/meetup', require('./routes/meetup'));
app.use('/meetups', require('./routes/meetups'));



app.get('/', (req, res) =>{
  res.render('MainPage');
});

app.get('/MakeEvent', (req, res) =>{
     res.render('AddPage');
});
app.get('/Event/:id/register', (req, res) =>{
  let result = MeetupController.GetQuestions(req,res);
    result.then(function(result){
        console.log(result);
      res.render('Form', {data: result});
    }).catch(function(error){
      res.send(error);
    });
});
app.get('/Validate/:id', (req, res) =>{
    var result = MeetupController.GetMeetupAndSpeakers(req.params.id);
    result.then(function(result){
      res.render('Validateuser', {data: result});
    }).catch(function(error){
      res.send(error);
    });
  });
app.listen(3000,()=>
{
  console.log("Listening on port 3000");
});
