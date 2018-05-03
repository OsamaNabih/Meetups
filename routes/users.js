const router = require('express').Router();
const passport = require('passport');
const passportConf = require('../passport');
const { validateBody, schemas} = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportAdmin = passport.authenticate('admin-local', { session: false })
const passportUser = passport.authenticate('user-local', { session: false })
const passportSignIn = passport.authenticate('local', { session: false })
const passportGoogle = passport.authenticate('googleToken',{session:false});
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const Multer  = require('../Multer.js');

//const passportJWT = passport.authenticate('jwt', { session: false});

router.route('/signup')
  .post(urlencodedParser,Multer.uploadPhoto,UsersController.photoUploaded, validateBody(schemas.signupAuthSchema), UsersController.signUp, (req, res)=>{
    if (req.error){
      console.log('error fel post');
      if (req.error.sqlMessage){
        console.log(req.error.sqlMessage);
        res.status(200).json({error: req.error.sqlMessage});
      }
      else{
        console.log("enta hena");
        console.log(req.error);
        res.status(200).json({error: req.error});
      }
    }
    else{
      res.status(200).json({ token: req.token});
    }
  })
  .get((req, res)=>{
    res.render('RegisterUsingAjax');
  });

router.route('/signin')
  .post(passportSignIn , UsersController.signIn, (req, res)=>{
    if (req.token){
      res.send({token: req.token});
    }
    else{
      res.send(req.error);
    }
  });

router.route('/oauth/facebook')
  .post(passport.authenticate('facebookToken', { session: false }), UsersController.facebookOAuth);

router.route('/oauth/google')
  .post(passportGoogle,UsersController.googleOAuth);


  //Applying Multer
router.route('/addprofilepicture')
  .post(Multer.uploadPhoto,UsersController.photoUploaded);


module.exports = router;
