const JWT = require('jsonwebtoken');
const UserModel = require('../models/user');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/keys')
signToken = (Id, type) =>{
    return JWT.sign({
    iss: 'Tafrah',
    sub: Id,
    type: type,
}, JWT_SECRET,{expiresIn:'24h'});
}

module.exports = {
  signUp: async(req, res, next) =>{
    //403 = forbidden
    let arr = req.value.body.birthDate.split("-"); // We'll assume months < 10 are prefixed with 0 e.g. 03 for March
    let MySQLDate = arr[2] + arr[0] + arr[1];
    // MySQLDate is a string that's initialized by the concatenation of 3 strings
    // MySQL requires date format to be an integer, so we perform arithmetic operations
    // on it to turn it into a number
    MySQLDate = Number(MySQLDate);
    req.value.body.birthDate = MySQLDate;
    // Generate a salt
   const salt = await bcrypt.genSalt(10);
   // Generate a password hash (salt + hash)
   const passwordHash = await bcrypt.hash(req.value.body.authField, salt);
   req.value.body.authField = passwordHash;
   req.value.body.authType = 1;
   req.value.body.userType = 3;
   const DB = new Database(DBconfig);
   DB.query(UserModel.InsertUser(), req.value.body).then(result =>{
     console.log('user inserted');
      return DB.query(UserModel.GetUserIdAndTypeByEmail(),req.value.body.email);
    }).then(innerResult =>{
      let id = innerResult[0].userId;
      let type = innerResult[0].userType;
      let token = signToken(id, type);
      return DB.close().then( () => { req.token = token; next(); } )
    },err => {
      return DB.close().then( () => { throw err; } )
    }).catch(error=>{
      req.error = error;
      next();
    });
  },


  signIn: async(req, res, next) =>{
    // Generate a token4
    const token = signToken(req.user[0].userId, req.user[0].userType);
    req.token = token;
    return next();
  },

  googleOAuth: async(req,res,next)=>{
    // Generate a token
    const token = signToken(req.userId,req.userType);
    res.status(200).json({token});
  },

  facebookOAuth: (req, res, next) => {
   // Generate token
   const token = signToken(req.user);
   res.status(200).json({ token });
 },
 photoUploaded:async (req, res, next)=>{
  //photo photouploaded
  if(req.error)
  {
    console.log("error in photoUploaded");
    res.status(404);
  }
  console.log("No error in photo uploading");
    return next();
}
}
