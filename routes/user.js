const  express  = require('express');
const {
  authUser,
  registerUser,
  logoutUser,
} = require('../controllers/user');

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);

export default router;