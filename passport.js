const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const { JWT_SECRET } = require('./config/keys');
const UserModel = require('./models/user');
const Database = require('./config/DB');
const DBconfig = require('./config/keys').DBconfig;
const bcrypt = require('bcryptjs');
const config = require('./config/keys');
// JSON WEB TOKENS STRATEGY

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) =>{
  try{
      // Find the user specifided in token
      const DB = new Database(DBconfig);
      const user = await DB.query(UserModel.GetUserIdAndTypeById(), payload.sub);
      await DB.close();
      if (user.length === 0){
        return done(null, false);
      }
      else if (user[0].userType !== 1){
        return done(null, false);
      }
      done(null, user);
  } catch(error) {
    done(error, false);
  }
}));



// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'authField'
}, async (email, authField, done) =>{
  try {
    // Find the user given the email
    const DB = new Database(DBconfig);
    let user = await DB.query(UserModel.GetUser(),email);
    await DB.close();
    if(!user){
      return done(null, false);
    }
    let authType = user[0].authType;
    if (authType !== 1){  //Checking his acc was made locally
      throw 'Email already exists with facebook/google login';
    }
    const dbPassword = user[0].authField;
    let isMatch = await bcrypt.compare(authField,dbPassword);
    if (!isMatch){
      return done(null, false);
    }
     // Otherwise, return the user
    done(null, user);
  } catch(error){
    done(error, false);
  }
}));

/*
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('profile', profile);
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);

    const DB = new Database(DBconfig);
    //place holder
    const existingUser = await DB.query(UserModel.GetUser(), profile.emails[0].value);
    if (existingUser.length !== 0){
      if (existingUser.authType === 2 && exstingUser.authField === profile.id){
        done(null, existingUser);
      }
      else{
        throw 'Email already exists';
      }
    }
    //const newUser = await DB.query(UserModel.InsertUser(), )

  } catch(error) {
    console.log(error);
    done(error, false, error.message);
  }
}));
*/
