const  express  = require('express');
const {

  email
} = require('../controllers/user');

const router = express.Router();


router.get("/email", email)

module.exports =  router;