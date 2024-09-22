const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Wallet"
    },
    roleId:{type: String, default: "user"},
    isVerified: {type: Boolean, default: false},
    otp:{type: String, required: true}
}, { createIndexes: true });


const User =  mongoose.model("User", user)

module.exports = User;
