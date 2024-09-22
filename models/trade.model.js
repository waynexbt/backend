const mongoose  = require("mongoose");

const tradeSchema = new mongoose.Schema({
    userId: String,
    amount: Number,
    profitPercentage: Number,
    startTime: Date,
    currency: String,
    totalProfit: Number,
    chunk: Number
  });
  
  const TradeModel = mongoose.model('Trade', tradeSchema);

module.exports = TradeModel;