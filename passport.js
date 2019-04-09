const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token');
const { JWT_SECRET } = require('./config/keys');
const UserModel = require('./models/user');
const Database = require('./config/DB');
const bcrypt = require('bcryptjs');
const config =require('./config/keys.js');
const DBconfig = require('./config/keys.js').DBconfig;
const GoogleStrategy = require('passport-google-oauth20');

// JSON WEB TOKENS STRATEGY
var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    if (token === undefined) throw 'No cookies found';
    return token;
};

module.exports.passportUser = (req, res, next)=>{
  if (req.cookies.jwt){
    console.log(req.cookies);
    passport.authenticate('user-local', { session: false })(req, res, next);
  }
  else{
    let user = {};
    user['userType'] = 0;
    user['userId'] = 0;
    req.user = user;
    console.log('No cookie');
    next();
  }
}

passport.use('user-local', new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET
}, async (payload, done) =>{
  try{
    console.log('fel strat');
      // Find the user specifided in token
      const DB = new Database(DBconfig);
      console.log(payload.userId);
      const user = await DB.query(UserModel.GetUserIdAndTypeById(), payload.userId);
      await DB.close();
      if (user.length === 0){
        console.log(user);
        user[0]['userType'] = 0;
        console.log(user);
        return done(null, user[0]);
      }
      done(null, user[0]);
  } catch(error) {
    //let user = {userType: 0};
    let user = {};
    user.userType = Number(0);
    console.log('f error passport');
    console.log(user);
    done(error, user);
  }
}));

module.exports.passportAdmin = (req, res, next)=>{
  if (req.cookies.jwt){
    console.log(req.cookies);
    passport.authenticate('admin-local', { session: false })(req, res, next);
  }
  else{
    console.log('maloosh 7a2');
    res.sendStatus(401);
  }
}

passport.use('admin-local', new JwtStrategy({
  //jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET
}, async (payload, done) =>{
  try{
    console.log('fel strat, payload: ');
    console.log(payload);
      // Find the user specifided in token
      const DB = new Database(DBconfig);
      const user = await DB.query(UserModel.GetUserIdAndTypeById(), payload.userId);
      await DB.close();
      if (user.length === 0){
        return done(null, false);
      }
      else if (user[0].userType !== 1){
        return done(null, false);
      }
      done(null, user[0]);
  } catch(error) {
    return done(error, false);
  }
}));



passport.use('google',new GoogleStrategy({

  callbackURL:'/users/oauth/google/redirect',
  clientID:config.oauth.google.clientID,
  clientSecret:config.oauth.google.clientSecret

}, async (accessToken,refreshToken,profile,done)=>{
    DB = new Database(DBconfig);
    DB.query(UserModel.GetUserIdAndTypeByEmail(),profile.emails[0].value).then(result=>{
  //    console.log("Access Token",accessToken);
  //    console.log("Referesh Token",refreshToken);
  //    console.log("Profile",profile);
      console.log("result",result);

      if(result.length>0)
          {
            let user = {userId: result[0].userId, userType: result[0].userType};
            done(null,user);
            throw "User already exists in our DataBase "
          }
        else
        {
                console.log("User doesnt exist we are creating new user");
                newUser={};
                newUser['email']=profile.emails[0].value;
                newUser['authField']=profile.id;
                newUser['firstName']=profile.name.givenName;
                newUser['lastName']=profile.name.familyName;
                newUser['userType']=3;                // Normal User
                newUser['authType']=3;              // Login by google
                return DB.query(UserModel.InsertUser(),newUser)
        }
    }).then( () =>{
                      let user = {userId: 3, userType: 3};
                      done(null,user);
                      return DB.close()
                  }, err => { return DB.close().then( () =>{ throw err; }) }
          ).catch(err => {
            if(err.message !== "User already exists in our DataBase ")
            {
              done(err,false,err.message);
              console.log(err);
            }
          });
    return done;
  })
);



  // LOCAL STRATEGY
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'authField'
  }, async (email, authField, done) =>{
    try {
      // Find the user given the email
      const DB = new Database(DBconfig);
      let user = await DB.query(UserModel.GetUser(),email);
      await DB.close();
      if(user.length === 0){
        throw 'Invalid email or password';
      }
      let authType = user[0].authType;
      if (authType !== 1){  //Checking his acc was made locally
        throw 'Email already exists with facebook/google login';
      }
      const dbPassword = user[0].authField;
      let isMatch = await bcrypt.compare(authField,dbPassword);
      if (!isMatch){
        user['error'] = 'Invalid email or password';
        console.log(user);
        done(null, user);
      }
       // Otherwise, return the user
      done(null, user);
    } catch(error){
      let user = {};
      user.error = error;
      done(null, user);
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
