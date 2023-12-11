const express = require('express');

const {
  validateData,
  registerAccount,
  fetchAccount,
  updateAccount,
  checkAccountExist,
  updatePassword,
  loginUsingStateToken,
  loginWithEmail,
  loginWithGoogle,
  sendingOTPForChangeEmail,
  updateEmailAddress,
  checkEmailAreadyExits,
  checkOTPExistForAccount

} = require('../controllers/user');

const {
  createSubscription,
  paymentCallback
} = require('../controllers/payment')

const authmiddleware = require("../middleware/ensureUserLoggedIn")

const router = express.Router();

router.post("/login-with-email", loginWithEmail);
router.post("/login-with-google", loginWithGoogle);
router.get("/user-profile", fetchAccount);
router.post("/register-account", validateData, registerAccount);
router.patch("/register-account/:userId", validateData, updateAccount);
router.post("forget-password/", checkAccountExist);
router.post("update-password/", updatePassword);
router.get("/redirect/login/:userToken", loginUsingStateToken);

router.post('/createSubscription', createSubscription);
router.get('/paymentCallback', paymentCallback);

//changing email address
router.use(authmiddleware.ensureUserLoggedIn);
router.post("/sending-otp",
  checkEmailAreadyExits,
  checkOTPExistForAccount,
  sendingOTPForChangeEmail
);

router.post("/update-emailaddress", updateEmailAddress);

module.exports = router;   
