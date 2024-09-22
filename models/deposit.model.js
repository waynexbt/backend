const mongoose = require('mongoose');

const deposit = new mongoose.Schema({
    userId: {type:String, required:true},
    username: {type: String, required:true},
    slipUrl: {type: String, required:true},
    amount: {type: Number, required:true},
    status: {type: String, default: "Pending"},
    ticketNumber: {type: String, required:true},
    currency: {type: String, required:true},
    role: {type: String, default: 'user'},
}, {timestamps: true})

const Deposit = mongoose.model('deposit', deposit);

module.exports = Deposit;