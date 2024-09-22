const User = require("../models/user.model")
const Wallet = require("../models/wallet.model")
const Withdrawal = require("../models/withdrawal.model")


exports.getAll= async (req, res)=>{
    try{
        const response = await Withdrawal.find({})
        res.send({status: 200, allWithDrwal: response})
    }catch(e){
        console.log(e)
        res.send({status: 400, e})
    }
    
}
exports.sendWithDrawal = async (req, res) => {
    try {
        const WithDrawal = await Withdrawal.findById(req.body.withDrawalId)
        console.log("WITHDRAWAL", WithDrawal)

        const userWithWallet = await User.findById(WithDrawal?.userId).populate("walletId").exec();

        if (userWithWallet?.walletId) {
            const userWallet = userWithWallet.walletId;
            console.log(userWallet);
            if(WithDrawal?.isComplete  === false) {
            if (userWallet) {
                const amountToAdd = parseFloat(req.body?.amount);
                if (!isNaN(amountToAdd)) {
                    console.log(amountToAdd);
                    const concernedAmount = userWallet?.currentBalance.find((items) => items.name == req.body.currency)
                    console.log("CONCERNED", concernedAmount)
                    concernedAmount.amount = concernedAmount.amount - amountToAdd;
                    const otherAmounts = userWallet?.currentBalance.filter((items) => items.name !== req.body.currency)
                    console.log("other amount", otherAmounts)
                    const updatedCurrentBalance = [...otherAmounts, concernedAmount];
                    userWallet.currentBalance = updatedCurrentBalance;
                    const newRec = await userWallet.save();
                    console.log("WALLLLLLLEEEE", newRec)
                    const withDrawalRes = await Withdrawal.findByIdAndUpdate(req?.body?.withDrawalId, 
                        { isComplete: true }, 
                        { new: true }
                        )
                    console.log("deposit", withDrawalRes)
                    res.status(200).json({ message: "success", status: 200, wallet: newRec, withDrawalRes });
                } else {
                    res.status(400).json({ message: "Invalid amount or currentBalance format", status: 400 });
                }
            }else{
                res.status(200).json({ message: "Withdrawal already completed!", status: 200 });

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
exports.createWithDrawal = (req, res) =>{
    try{
        const withDrawal = new Withdrawal(req.body)
        withDrawal.save()
        res.send({status:200, withDrawal, message:"success"})
    }catch(e){
        console.log(e)
    }
}