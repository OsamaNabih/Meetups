const router = require('express').Router();
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas} = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', { session: false })



router.route('/signup')
  .post(validateBody(schemas.signupAuthSchema), UsersController.signUp, (req, res)=>{
    if (req.error){
      if (req.error.sqlMessage){
        res.send(req.error.sqlMessage);
      }
      else{
        res.send(req.error);
      }
    }
    else{
      res.send({ token: req.token});
    }
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

module.exports = router;
