const JWT = require('jsonwebtoken');
const UserModel = require('../models/user');
const Database = require('../config/DB');
const DBconfig = require('../config/keys').DBconfig;
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/keys')
signToken = (Id, type) =>{
    return JWT.sign({
    iss: 'Tafrah',
    userId: Id,
    userType: type,
}, JWT_SECRET,{expiresIn:'24h'});
}

module.exports = {
  getDataBase: function (DBconfig){
    var db = new Database(DBconfig)
    return db
  },
  signUp: async(req, res, next) =>{
    //403 = forbidden
    // Generate a salt
   const salt = await bcrypt.genSalt(10);
   // Generate a password hash (salt + hash)
   const passwordHash = await bcrypt.hash(req.value.body.authField, salt);
    req.value.body.authField = passwordHash;
   req.value.body.authType = 1;
   req.value.body.userType = 3;
   if(req.file)
   {
     req.value.body.imagePath=req.file.path;
   }
   else
   {
     req.value.body.imagePath = "Images/default-avatar.png";
   }
   const DB = new Database(DBconfig);
   DB.query(UserModel.InsertUser(), req.value.body).then(result =>{
      return DB.query(UserModel.GetUserIdAndTypeByEmail(),req.value.body.email);
    }).then(innerResult =>{
      let id = innerResult[0].userId;
      let type = innerResult[0].userType;
      let token = signToken(id, type);
      return DB.close().then( () => { req.token = token; next(); } )
    },err => {
      console.log(err);
      return DB.close().then( () => { throw err; } )
    }).catch(error=>{
      console.log(error);
      req.error = error;
      next();
    });
  },


  signIn: async(req, res, next) =>{
    // Generate a token
    if (req.user.error){
      req.error = req.user.error;
      next();
    }
    else{
      const token = signToken(req.user[0].userId, req.user[0].userType);
      req.token = token;
      next();
    }
  },

  googleOAuth: async(req,res,next)=>{
    // Generate a token
    const token = signToken(req.user.userId,req.user.userType);
    res.cookie('jwt', token); // add cookie here
    //res.status(200).json({token});
    res.redirect('/');
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
  if(req.file == undefined)
    {
      console.log("No Photo Seleced");
      return next();
    }
  console.log("No error in photo uploading");
    return next();
  },
  GetUserInfo: async(req, res)=>{
    try{
      const DB = await module.exports.getDataBase(DBconfig);
      let result = await DB.query(UserModel.GetUserById(), req.params.id);
      await DB.close();
      return result[0];
    }
    catch (error){
      console.log(error);
      throw error;
    }
  }
}
