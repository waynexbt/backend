const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema({
    currentBalance: [
        {
            name: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ],
    totalDeposit: { type: Number, default: 0 },
    totalWithdraw: { type: Number, default: 0 }


})

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet;