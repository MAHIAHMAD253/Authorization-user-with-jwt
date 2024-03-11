const {getuser, createUser, signIn, changeUser} = require ('../controller/user')
const express = require('express')

const {jwtAuth} = require('../midleware/jwtVerifation')

const router = express.Router();

router.get('/',getuser)
router.post('/signUp',createUser)
router.post('/signIn',signIn)
router.post('/update',jwtAuth,changeUser)

module.exports = router;