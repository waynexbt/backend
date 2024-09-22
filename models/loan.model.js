const mongoose = require('mongoose');

const loan = new mongoose.Schema({
    userId: {type: String, required: true},
    isPass: {type: Boolean, default: false},
    isReturned: {type: Boolean, default: false},
    frontId: {type: String, required: true},
    backId: {type: String, required: true},
    username: {type: String, required: true},
    acceptanceProof: {type: String},
    disagreementStat: {type: String}
}, {timestamps: true})


const Loan = mongoose.model("Loan", loan)

module.exports = Loan