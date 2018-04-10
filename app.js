const express = require('express');
//const keys = require('./config/keys');
const passport = require('passport');
const http = require('http');
const morgan = require('morgan');
const MeetupsController = require('./controllers/meetups');
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
app.use('/', require('./routes/meetups'));


app.get('/Event/:id', (req, res) =>{
  var id = req.params.id;
     var result = MeetupsController.Event(req, res, id);
   result.then(function(result){
     //res.send(result);
     res.render('Event', {Meetup: result[0]});
   });
});
app.get('/Events', (req, res) =>{
   var result = MeetupsController.home(req, res);
   result.then(function(result){
     //res.send(result);
     res.render('Events', {meetups: result});
   });
});

app.get('/MakeEvent', (req, res) =>{
     res.render('AddPage');
});

app.get('/Register', (req, res) =>{
  res.render('Registration');
});
app.listen(3000,()=>
{
  console.log("Listening on port 3000");
});
