const User = require("../models/user.model");

exports.exchangeCoin= async (req, res)=>{
    try{
        
        let amount = parseFloat(req.body.amount);
        let convertedAmount = parseFloat(req.body.convertedAmount);
        
        const user = await User.findById(req.body.userId).populate("walletId").exec();
        console.log("USER",user)
        if(user){
            console.log("REQQQ", req.body)
            const userWallet = user?.walletId
            const from = userWallet?.currentBalance.find((item)=> item.name === req.body.from)
            const to = userWallet?.currentBalance.find((item)=> item.name === req.body.to)
            if(from.amount > amount){
                from.amount = from.amount - (amount)
                to.amount = to.amount + convertedAmount
            }
            const restOfArr = userWallet?.currentBalance.filter((item)=> item.name !== req.body.from && item.name !== req.body.to)
            userWallet.currentBalance = [...restOfArr, from, to]
            const response = await userWallet.save()
            console.log("newBalance",[...restOfArr, from, to], "RES",res)
            res.send({status: 200, message: "Conversion successful"})

        }else{
            res.send({status: 404, message:`User not found`})
            console.log("NOT FOUND USER")
        }
    }catch(err){
        console.log("NOT FOUND USER", err)
        res.send({status: 502, message:"SERVER ERROR", error:err});
    }

}