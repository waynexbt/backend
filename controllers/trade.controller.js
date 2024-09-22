const TradeModel = require('../models/trade.model');
const User = require('../models/user.model');
const cron = require('node-cron');
const axios = require('axios')

exports.startTrade = async (req, res) => {
  const { amount, percentage, userId, currency } = req.body;
  console.log("RAAW BODY",req.body, "RAWW");

  const total = (amount * percentage) / 100;
  try {
    const user = await User.findById(userId).populate('walletId').exec();
    if (user && amount && percentage && userId && currency) {
        const totalProfit = (amount * percentage)/100
        const chunk = (totalProfit/100) * 10
        const toNumberAmount = Number(amount)
      const trade = new TradeModel({
        userId,
        amount: toNumberAmount,
        profitPercentage: percentage,
        startTime: new Date(),
        currency,
        totalProfit,
        chunk
      });
      await trade.save()
      res.send({status: 200, message:"Success"})
    } else {
      console.log('USER NOT FOUND');
      res.send({status: 404, message:"User not found"})
    }
  } catch (e) {
    console.log('ERRRORORORORO', e);
  }
};

 cron.schedule('* * * * *', async () => {
    console.log("CRON ")
    const trades = await TradeModel.find();
  if(trades.length > 0) {
    trades.forEach(async trade => {
    //   const elapsedTimeInHours = (Date.now() - trade.startTime) / (1000 * 60);
    //   const profitToAdd = (trade.amount * trade.profitPercentage) / 100;
    //   console.log([profitToAdd, elapsedTimeInHours])
    //   const amountToAdd = profitToAdd / elapsedTimeInHours;


    // __________________________________________
        if(Number(trade.totalProfit ) > 0){

            const slicePercentage = (Number(trade.totalProfit)/100) * 10
            const user = await User.findById(trade?.userId).populate("walletId").exec();
            if(user){
                const userWallet = user.walletId
                const concernedAmount = userWallet.currentBalance.find((item)=> item.name == trade.currency);
                concernedAmount.amount = concernedAmount.amount + parseFloat(trade?.chunk)
                const wallet = await userWallet.save()
                trade.totalProfit = trade.totalProfit - parseFloat(trade?.chunk)
                await trade.save()
                console.log(wallet,"TRADE", trade)
                
            }
        } else{ console.log("TRADE COMPLETED")}
    });
}else{
    console.log("ALL TRADES COMPLETED")
}
  });

  exports.getPrices = async (req, res) => {
    const { frequency } = req.body;
  
    if (!frequency) {
      return res.status(400).send('Please provide a frequency (e.g., 1m, 5m, 30m, 1h, 6h, 1d)');
    }
  
    try {
      const symbol = 'BTCUSDT';
      const rootUrl = 'https://api.binance.com/api/v1/klines';
      const url = `${rootUrl}?symbol=${symbol}&interval=${frequency}`;
      console.log(url);
  
      const response = await axios.get(url);
      const data = response.data;
  
      // Exclude the last record
      const dataExcludingLast = data.slice(0, -1);
  
      const df = dataExcludingLast.map(d => ({
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        time: new Date(d[0]).toISOString().split('.')[0] // remove milliseconds
      }));
  
      res.json(df);
  
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred.');
    }
  };
  