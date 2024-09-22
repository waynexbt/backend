const { generateKey } = require('crypto');
const { encryptPass } = require('../config/encryption');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const bcrypt = require('bcrypt');
const {generateToken} = require('../config/jwtAuth');
const sendEmail = require('../config/EmailSender');

const currencies = [{name:"USDT-ERC", amount:0},
                        {name:"USDT-TRC", amount:0},
                        {name:"BTC", amount:0},
                        {name:"ETH", amount:0}                   
]

exports.getAllUsers = (req, res) => {
  res.send({ msg: 'ALL USER' });
};


function generateRandomSixDigitNumber() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number

  const randomDecimal = Math.random();
  const randomSixDigitNumber = Math.floor(randomDecimal * (max - min + 1)) + min;

  return randomSixDigitNumber;
}
// console.log(generateRandomSixDigitNumber())

exports.createUser = async (req, res) => {
  console.log('THE BODY', req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const response = await User.findOne({ username: req.body.username });
      if (!response) {
        try {
          const newWallet = new Wallet({currentBalance: currencies});
          await newWallet.save();
          console.log(req.body.password, 'PASSSS INCCCCCC');
          const newUser = new User({ ...req.body, walletId: newWallet._id, role:"user",otp: generateRandomSixDigitNumber() });
          await newUser.save();
          const shrinkedUser = newUser.toObject();
          delete shrinkedUser['password'];
          delete shrinkedUser['otp'];
          res.send({
            status: 200,
            message: 'User created success',
            body: shrinkedUser,
          });
        } catch (err) {
          console.log({ status: 400, err, errMessage: 'Error saving user' });
          res.send({ status: 400, errMessage: 'Error saving user' });
        }
      } else {
        console.log(response);
        res.send({ status: 409, errMessage: 'change username' });
      }
    } else {
      console.log(user);
      res.send({ status: 409, message: 'Email already in use' });
    }
  } catch (error) {
    console.log({ error, errMessage: 'ERROR IN REQUEST' });
    res.send({ status: 400, error: error });
  }
};



exports.userLogin = async (req, res) => {
  console.log({msg:"REQ INN",body:req.body})
  try {
    let user = await User.findOne({ email: req.body.email }).populate("walletId").exec();
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        console.log({ error: err, result: result });
        if (result) {
          // if(user?.isVerified === true){

            const returnedUser = user.toObject();
            delete returnedUser['password'];
            // console.log(returnedUser);
            const token = generateToken(user.password)
            res.send({ status: 200, message: 'login success', user:{...returnedUser, token} });
            console.log("LOGIN SCCESSFUL", returnedUser, token);
          // }else{
          //   res.send({ status: 403, message: 'otp-verification'});

          // }
        } else if (err) {
          res.send({ status: 502, message: 'ERROR Login Failed', err });
        } else {
          res.send({ status: 401, message: 'incorrect password' });
        }
      });
    } else {
      res.send({ status: 404, message: 'User not found' });
    }
  } catch (e) {
    console.log({ e, mssage: 'ERROR IN SERVER' });
    res.send({ e, message: 'error in server' });
  }
};

exports.sendOtp = async (req, res)=>{
  try{
    console.log("CLG BODY IN OTP",req.body)
    const user = await User.findOne({email: req?.body?.email})
    console.log("USER IN OTP CONTROLKERR",user)
    await sendEmail(user)
    res.send({status:200, message:"OTP Generated Success"})
  }catch(error){
    console.log(error)
  }
}

exports.verifyOtp = async (req, res) =>{
  try{
    const user = await User.findOne({email: req?.body?.email})
    if(user){
      if(user.otp === req.body.otp){
        user.isVerified = true;
        await user.save();
        res.send({status:200, message: "user verification successful"})
      }else{
        res.send({status:401, message:"Invalid OTP" })
      }
    }else{
      res.send({status:404, message:"User not found"})
    }
  }catch(error){
    console.log(error)
    res.send({status:500, message:"Error in server", error:error})
  }
}

exports.getWallet= async (req, res )=>{
  try{
    const wallet = await Wallet.findById(req.body.walletId)
    res.send({wallet:wallet, status:200})
  }catch(e){
    res.send({status:500, message:"Error in wallet", error:e})
  }

}

exports.UpdateWallet= async (req, res )=> { 
  const { id, name, amount } = req.body;

  try {
    // Find the wallet by ID
    const wallet = await Wallet.findById(id);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Find the currency by name and update the amount
    const balanceItem = wallet.currentBalance.find(item => item.name === name);
    
    if (!balanceItem) {
      return res.status(404).json({ message: 'Currency not found in wallet' });
    }

    balanceItem.amount = amount;

    // Save the updated wallet
    await wallet.save();

    res.json({ message: 'Wallet updated successfully', wallet, status:200, amount: balanceItem.amount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};