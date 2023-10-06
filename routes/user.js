const  express  = require('express');
const {
  validateData,
  registerAccount,
  fetchAccount,
  updateAccount,
  checkAccountExist,
  updatePassword,
  deleteAccount
  
} = require('../controllers/user');

const router = express.Router();

router.get("/user-profile", fetchAccount );
router.post("/register-account",validateData,registerAccount);
router.patch("/update-account/:userId",validateData,updateAccount);
router.post("/forget-password",checkAccountExist);
router.post("/update-password",updatePassword);
router.delete("/delete-account",deleteAccount);

module.exports =  router;