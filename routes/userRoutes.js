const express = require('express');
const router = express.Router()
const userControllers = require('../controllers/user.controllers');
const { encryptPass } = require('../config/encryption');
const { authVerification } = require('../config/jwtAuth');

router.post('/get',authVerification, userControllers.getAllUsers )
router.post('/create', encryptPass ,userControllers.createUser )
router.post("/login", userControllers.userLogin)
router.post("/sendOtp", userControllers.sendOtp)
router.post("/verifyOtp", userControllers.verifyOtp)
router.post("/getWallet", userControllers.getWallet)
router.post("/updateWallet", userControllers.UpdateWallet)



module.exports = router;