const express = require('express');
const router = express.Router();
const exchangeController = require("../controllers/exchange.controllers")
router.post("/coins", exchangeController.exchangeCoin )

module.exports = router