const express = require('express');
const depositeController = require('../controllers/deposite.controller');
const { isAdmin, authVerification } = require('../config/jwtAuth');
// const upload = require('../config/multer');
const router = express.Router()
const fs = require("fs")

// const multer = require("multer")

var multer = require("multer");
const User = require('../models/user.model');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = './files/';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
  
    console.log("in multer",file)
    cb(null, './files/');
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
});
const adminCheck = async (req, res, next)=>{
 
  console.log("ADMIN CHECK", "ID",req.headers.id)
  try{
    if(req.headers.id  ){
      const user = await User.findById(req.headers.id);
      console.log(user)
      if(user?.roleId == "admin" ){
        next()
      }else{
        res.send({status: 401, message:"User not allowed to access"})
      }
    }else{
      res.send({status: 401, message:"User not allowed to access"})
    }
  }catch(e){
    res.send({status: 502, message:"SERVER ERROR", error:e})
  }
}
router.get('/getAllDeposit', adminCheck,depositeController.getAllDeposit )
router.get("/getAllById/:userId",authVerification , depositeController.getAllById)
router.post("/createDeposit",upload.single("demo_image"), depositeController.createDeposit)
router.post("/updateDeposit", depositeController.updateDeposit)
router.post("/confirmDeposit",authVerification,adminCheck, depositeController?.approveDeposit)


module.exports = router;

