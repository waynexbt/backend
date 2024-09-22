const express = require('express');

const router = express.Router()
const tradeController = require("../controllers/trade.controller")
router.post("/start", tradeController.startTrade )
router.post("/prices", tradeController.getPrices )


module.exports = router