const router = require('express').Router();
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas} = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', { session: false })
const passportGoogle = passport.authenticate('googleToken',{session:false});
//const passportJWT = passport.authenticate('jwt', { session: false});



router.route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
  .post(passportSignIn , UsersController.signIn);

router.route('/oauth/google')
  .post(passportGoogle,UsersController.googleOAuth);
module.exports = router;
