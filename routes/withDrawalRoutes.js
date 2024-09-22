const express = require('express');
const router = express.Router();
const withDrawalController = require("../controllers/withdrawal.controller")
router.get('/getAll', withDrawalController?.getAll )
router.post("/create", withDrawalController?.createWithDrawal)
router.post("/acceptWithdrawal", withDrawalController?.sendWithDrawal)


module.exports = router;