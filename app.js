const express = require('express');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const http = require('http');
const authRoutes = require('./routes/auth-routes');


const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRoutes);
