const mongoose = require('mongoose');
const { Schema } = mongoose;

const custom_data = new Schema({
  totalBalance: { type: Number, required: false },
  candlesticks: [
    {
      close: { type: Number, required: false },
      high: { type: Number, required: false },
      low: { type: Number, required: false },
      open: { type: Number, required: false },
      time: { type: Number, required: false },
      _internal_originalTime: { type: Number, required: false },
    }
  ]
});

const Custom_Data = mongoose.model('custom_data', custom_data);

module.exports = Custom_Data;
