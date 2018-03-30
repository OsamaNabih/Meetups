const JWT = require('jsonwebtoken');
const UserModel = require('../models/user');
const DB = require('../config/DB');
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

    //Check if a there is a user with the same email
    //403 = forbidden
    // Create a new user
    console.log(req.value.body);
    DB.query(UserModel.InsertUser(), req.value.body, (error, result) =>{
      if (error){
        console.log(error.sqlMessage);
        console.log('ana error');
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
