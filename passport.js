const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const { JWT_SECRET } = require('./config/keys');
const UserModel = require('./models/user');
const Database = require('./config/DB');
const bcrypt = require('bcryptjs');
const config =require('./config/keys.js').config;

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
//Google Oauth STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({

  clientID:'835631524663-b6nhvpmsbpndqa8g4m051r5qd4iujgjt.apps.googleusercontent.com',
  clientSecret:'KlCyyv2VcOc07Gzhktkj1RKX'

},async(accessToken,refereshToken,profile,done)=>{
//  console.log('accessToken',accessToken);
  //console.log('refereshToken',refereshToken);
  //console.log('profile',profile);
    DB = new Database(config);
    DB.query(UserModel.GetUserByForeignId(),profile.id).then(result=>{
      if(result.length>0)
          {
            done(null,result[0]);
            throw "User already exists in our DataBase "
          }
        else
        {
          console.log("User doesnt exist we are creating new user");
                newUser={};
                newUser['email']=profile.emails[0].value;
                newUser['foreignId']=profile.id;
                newUser['firstName']=profile.name.givenName;
                newUser['lastName']=profile.name.familyName;
                newUser['userType']=3;                // Normal User
                newUser['loginType']=3;              // Login by google
                return DB.query(UserModel.InsertUser(),newUser)
        }
    }).then( () =>{
                      done(null,newUser);
                      return DB.close()
                  }, err => { return DB.close().then( () =>{ throw err; }) }
          ).catch(err => {
            done(err,false,err.message);
            console.log(err);
          });


    return done;
  }));



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
