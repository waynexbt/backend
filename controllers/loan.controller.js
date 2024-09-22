
const Loan = require("../models/loan.model")
const User = require("../models/user.model")

exports.getAll = async (req, res) =>{
    try{
        const response = await Loan.find()
        res.send({status: 200, message: "success", response})
    }catch(err){
        res.send({status: 404, message:"Not Found"})
    }
}

exports.createLoan = async (req, res)=>{
    const loanData = JSON.parse(req?.body?.userData[0])
    console.log(loanData)

    console.log(req.files)

    try{
        const loan = new Loan({userId: loanData?.user?._id, username: loanData?.user?.username, frontId: req.files[0]?.filename,backId: req.files[1]?.filename })
        await loan.save()
        res.send({status:200, message: 'Success', loan})
    }catch(err){
        res.send({status: 404, message: err.message, error: err})
        console.log('ERROR', err, "ERROR")
    }
}


exports.acceptLoanRequest = async (req, res)=>{
    console.log(req?.body)
    try {
        const userWithWallet = await User.findById(req?.body?.userId).populate("walletId").exec();

        if (userWithWallet?.walletId) {
            const userWallet = userWithWallet.walletId;
            console.log(userWallet);

            if (userWallet) {
                const amountToAdd = parseFloat(req.body?.amount);
                console.log("PARSED AMOUNT",amountToAdd);
                if (!isNaN(amountToAdd)) {
                    const concernedAmount = userWallet?.currentBalance.find((items) => items.name == "USDT-ERC")
                    concernedAmount.amount = concernedAmount.amount + 5000;
                    const otherAmounts = userWallet?.currentBalance.filter((items) => items.name !== "USDT-ERC")
                    const updatedCurrentBalance = [...otherAmounts, concernedAmount];
                    userWallet.currentBalance = updatedCurrentBalance;
                    const newRec = await userWallet.save();
                    const depositRes = await Loan.findByIdAndUpdate(req?.body?.loanId, 
                        { isPass: true }, 
                        { new: true }
                        )
                    console.log("deposit", depositRes)
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

exports.cancelLoanRequest = async (req, res)=>{
    try{
        const loan = await Loan.findByIdAndUpdate(req.body._id, 
            {disagreementStat: req.body.statement}, {new:true})
            res.send({status: 200, message:"Loan request caceled successfully"})
    }catch(err){
        res.send({status: err, message:"Loan request caceled successfully"})

    }
}

exports.getAllById = async (req, res) => {
    try {
        const response = await Loan.find({ userId: req.params.userId })
        res.send({ status: 200, message: "Success", response })
    } catch (error) {
        res.send({ status: 404, message: "Error", error })
    }
}