const JWT = require('jsonwebtoken');
const UserModel = require('../models/user');
const DB = require('../config/DB');
const bcrypt = require('bcryptjs');
/*
const { JWT_SECRET } = require('../config/keys')
signToken = user =>{
  return JWT.sign({
    iss: 'CodeWorkr',
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1) //current time + 1 day ahead
  }, JWT_SECRET);
}
*/

module.exports = {
  signUp: async(req, res, next) =>{
    //403 = forbidden
    let arr = req.value.body.birthDate.split("-"); // We'll assume months < 10 are prefixed with 0 e.g. 03 for March
    let MySQLDate = arr[2] + arr[0] + arr[1];
    // MySQLDate is a string that's initialized by the concatenation of 3 strings
    // MySQL requires date format to be an integer, so we perform arithmetic operations
    // on it to turn it into a number
    MySQLDate = MySQLDate / 2.0;
    MySQLDate = MySQLDate * 2.0;
    req.value.body.birthDate = MySQLDate;
    console.log(req.value.body);
    // Generate a salt
   const salt = await bcrypt.genSalt(10);
   // Generate a password hash (salt + hash)
   const passwordHash = await bcrypt.hash(req.value.body.password, salt);
   req.value.body.password = passwordHash;
    DB.query(UserModel.InsertUser(), req.value.body, (error, result) =>{
      if (error){
        console.log(error.sqlMessage);
      } else{
        console.log('insertion succeeded');
      }
    });
    // Respond with token
    //res.json({user: 'created'});
    /*
    const token = signToken(newUser);
    res.status(200).json({ token: token});
    */
  },
  /*
  signIn: async(req, res, next) =>{
    // Generate a token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  secret: async(req, res, next) =>{
    res.json({secret: "resource"});
  }
  */
}
