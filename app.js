const express = require('express');
//const keys = require('./config/keys');
//const cookieSession = require('cookie-session');
const passport = require('passport');
const http = require('http');
const authRoutes = require('./routes/auth-routes');


const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));

app.use(passport.initialize());
app.use(passport.session());

app.get('/Event/:id', (req, res) =>{
  res.render('Event');
});
app.get('/Events', (req, res) =>{
  res.render('Events');
});
app.get('/', (req, res) =>{
  res.render('MainPage');
});
app.get('/Register', (req, res) =>{
  res.render('Registration');
});
app.use('/auth',authRoutes);
app.listen(3000,()=>
{
  console.log("Listening on port 3000");
});
