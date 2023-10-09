const  express  = require('express');

const {
  validateData,
  registerAccount,
  fetchAccount,
  updateAccount,
  checkAccountExist,
  updatePassword,
  loginUsingStateToken
  
} = require('../controllers/user');

const router = express.Router();

router.get("/user-profile", fetchAccount );
router.post("/register-account",validateData,registerAccount);
router.patch("/register-account/:userId",validateData,updateAccount);
router.post("forget-password/",checkAccountExist);
router.post("update-password/",updatePassword);
router.get("/redirect/login/:userToken",loginUsingStateToken);

module.exports =  router;