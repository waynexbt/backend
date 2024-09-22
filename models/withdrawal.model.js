const mongoose = require('mongoose');

const withdrawal = new mongoose.Schema({
    username: {type:String, required: true},
    userId:{type:String, required: true},
    isComplete: {type:Boolean, default: false},
    reciept:{type:String},
    accountNumber: {type:String, required: true}, 
    currency: {type:String, required: true},
    amount:{type:Number, required: true}
})

const Withdrawal = mongoose.model('WithDrawal', withdrawal)

module.exports = Withdrawal;