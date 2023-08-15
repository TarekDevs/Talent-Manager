const express = require('express')
const { getUser, UpdateUser } = require('../controllers/User');
const router = express.Router()



router.get('/getuser/:id', getUser);
router.put('/updateuser/:id', UpdateUser);


module.exports = router;
