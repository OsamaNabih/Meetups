const express = require('express');
const keys = require('./config/keys');
const passport = require('passport');
const http = require('http');
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
// Setting up the MySQL DB
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'tafrah'
});

db.connect((err) =>{
  if(err){
      throw err;
  }
  console.log('Connected to MySQL DB');
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(passport.initialize());
app.use(passport.session());

app.listen(3000, ()=>{
  console.log('listening on port 3000');
});
