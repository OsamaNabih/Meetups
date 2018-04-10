const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { JWT_SECRET } = require('./config/keys');
const UserModel = require('./models/user');
const DB = require('./config/DB');
const bcrypt = require('bcryptjs');

// JSON WEB TOKENS STRATEGY
/*
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) =>{
  try{
      // Find the user specifided in token
      const user = await User.findById(payload.sub);
      // If user doesn't exist, handle it
      if (!user) {
        return done (null, false);
      }
      // Otherwise, return the user
      done(null, user);
  } catch(error) {
    done(error, false);
  }
}));
*/


// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email',

},  (email, password, done) =>{
  try {
    // Find the user given the email
          DB.query(UserModel.GetUser(),email,(error,result)=>{
          if(error)
            console.log(error);
          else if (!result) {
              return done(null, false);
          }
          else{
            // Check if the password is correct
              const dbPassword = result[0].password;
                bcrypt.compare(password,dbPassword,function(err,res){    // await should be written here as 3amo
                 if (!res) {
                   console.log(res);
                   return done(null, false);
                    }
               // Otherwise, return the user
                 console.log(res);
                 done(null, result[0].userId);

              });
          }
        });
    } catch(error) {
          done(error, false);
    }
}));
