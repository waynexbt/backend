const { randomUUID } = require("crypto")
const Deposit = require("../models/deposit.model")
const Wallet = require("../models/wallet.model")
const User = require("../models/user.model")





exports.getAllDeposit = async (req, res) => {
    try {
        const response = await Deposit.find()
        res.send({ status: 200, statusText: response.status, deposites: response })
    } catch (error) {
        res.send({ status: 404, message: "No data fount", error })
    }
}

exports.getAllById = async (req, res) => {
    try {
        console.log(req.params)
        const response = await Deposit.find({ userId: req.params.userId })
        res.send({ status: 200, message: "Success", response })
    } catch (error) {
        res.send({ status: 404, message: "Error", error })
    }
}


exports.createDeposit = async (req, res) => {
    // console.log("REQ in create depo",req,"REQ in create depo")
    try {
        const id = randomUUID()
        const newData = JSON.parse(req?.headers?.data || req?.body?.data)
        // console.log({BODY:req.body,FILES:req.files, header:req.headers, newData})
        const deposit = new Deposit({
            userId: newData?.userId,
            username: newData?.username, amount: newData?.amount,
            ticketNumber: id, slipUrl: req.file?.filename,
            currency: newData?.currency
        })
        await deposit.save()
        res.send({ status: 200, message: "Success", deposit })
        console.log("created deposit",deposit)
    } catch (error) {
        res.send({ status: 502, error: error })
        console.log(error,"ERROR in DEPOSIT CREATE")
    }

}

exports.updateDeposit = async (req, res) => {
    try {
        const response = await Deposit.findByIdAndUpdate(req.body.depositId, 
            { status: "Success" }, 
            { new: true }
            )
        res.send({ status: 200, response, message: "success" });
    } catch (error) {
        res.send({ status: 404, message: "Deposite not found" });
    }
}

exports.approveDeposit = async (req, res) => {
    console.log("DEPOSITTTT", req.headers)
    try {
        const userWithWallet = await User.findById(req?.body?.userId).populate("walletId").exec();

        if (userWithWallet?.walletId) {
            const userWallet = userWithWallet.walletId;
            // console.log(userWallet);

            if (userWallet) {
                const amountToAdd = parseFloat(req.body?.amount);
                if (!isNaN(amountToAdd)) {
                    // console.log(amountToAdd);
                    const concernedAmount = userWallet?.currentBalance.find((items) => items.name == req.body.currency)
                    // console.log("CONCERNED", concernedAmount)
                    concernedAmount.amount = concernedAmount.amount + amountToAdd;
                    const otherAmounts = userWallet?.currentBalance.filter((items) => items.name !== req.body.currency)
                    // console.log("other amount", otherAmounts)
                    const updatedCurrentBalance = [...otherAmounts, concernedAmount];
                    userWallet.currentBalance = updatedCurrentBalance;
                    const newRec = await userWallet.save();
                    const depositRes = await Deposit.findByIdAndUpdate(req?.body?.depositId, 
                        { status: req.body?.success ? "Success" : "Rejected" }, 
                        { new: true }
                        )
                    // console.log("deposit", depositRes)
                    res.status(200).json({ message: "success", status: 200, wallet: newRec, depositRes });
                } else {
                    res.status(400).json({ message: "Invalid amount or currentBalance format", status: 400 });
                }
            }
        } else {
            res.status(404).json({ message: "User or wallet not found", status: 404 });
        }
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error", status: 500, error: e.message });
        console.error(e);
    }
}

exports.startTrade =()=>{
    
}