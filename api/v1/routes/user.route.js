var express = require('express');
var router = express.Router();
require('../../../models/user.model');

// import middleware 
const auth = require('../../../server/middleware/auth');

// import controller
const UserController = require('../controller/user.controller');

/* APIs listing. */
// router.get('/', UserController.getAllCookies);
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/forget-password', UserController.forgetPassword);
router.post('/code-verfication', UserController.codeVerification);
router.post('/reset-password', UserController.resetPassword);

module.exports = router;