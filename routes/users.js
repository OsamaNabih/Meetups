const router = require('express').Router();
const passport = require('passport');
const passportConf = require('../passport');
const { validateBody, schemas} = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
//const passportAdmin = passport.authenticate('admin-local', { session: false })
const passportAdmin = require('../passport').passportAdmin;
//const passportUser = passport.authenticate('user-local', { session: false })
const passportUser = require('../passport').passportUser;
const passportSignIn = passport.authenticate('local', { session: false })
const passportGoogle = passport.authenticate('googleToken',{session:false});
const passportGoogleOauth = passport.authenticate('google',{session:false,scope:['profile','email']})
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const Multer  = require('../Multer.js');

//const passportJWT = passport.authenticate('jwt', { session: false});

router.route('/signup')
  .post(urlencodedParser,Multer.uploadPhoto,UsersController.photoUploaded, validateBody(schemas.signupAuthSchema), UsersController.signUp, (req, res)=>{
    if (req.error){
      if (req.error.sqlMessage){
        res.status(200).json({error: req.error.sqlMessage});
      }
      else{
        console.log(req.error);
        res.status(200).json({error: req.error});
      }
    }
    else{
      res.cookie('jwt', req.token); // add cookie here
      res.redirect('/');
    }
  })
  .get((req, res)=>{
    res.render('RegisterUsingAjax');
  });

router.route('/signin')
  .post(urlencodedParser, passportSignIn, UsersController.signIn, (req, res)=>{
    if (req.token){
      res.cookie('jwt', req.token); // add cookie here
      res.status(200).json({token: req.token});
    }
    else{
      res.status(200).json({error: req.error});
    }
  })
  .get((req, res)=>{
    res.render('SignIn');
  });

router.route('/:id')
  .get((req, res)=>{
    let result = UsersController.GetUserInfo(req, res);
    result.then((result)=>{
      res.render('profile', {user: result});
    }).catch((error)=>{
      res.status(400).json(error);
    });
  });

router.route('/oauth/facebook')
  .post(passport.authenticate('facebookToken', { session: false }), UsersController.facebookOAuth);


// edit users information, gets error on testing for god knows what reason
router.route('/editProfile')
  .get((req,res)=>{
    res.render('editProfile');
  })
  .post(urlencodedParser, (req,res)=>{
    console.log(req.body);
    res.send("");
  });

  /*
router.route('/oauth/google')
  .get(passportGoogleOauth);

  router.route('/oauth/google/redirect')
    .get(passportGoogleOauth,UsersController.googleOAuth);


  //Applying Multer
router.route('/addprofilepicture')
  .post(passportUser, Multer.uploadPhoto,UsersController.photoUploaded);
*/

module.exports = router;
