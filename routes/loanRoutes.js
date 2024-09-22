const router= require("express").Router();
const multer = require("multer");
const loanController = require("../controllers/loan.controller")
const fs = require("fs");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = './IDs/';
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
    
      console.log("in multer",file)
      cb(null, './IDs/');
    },
    filename: function(req, file, cb) {
      console.log(file)
      cb(null, new Date().getTime() + file.originalname);
    }
  });
  var upload = multer({
    storage: storage
  });
  
  




router.get("/getAllLoan", loanController.getAll)
router.post("/createLoan",upload.any("media"),loanController.createLoan)
router.post("/acceptLoanRequest", loanController.acceptLoanRequest)
router.get("/getAllById/:userId", loanController.getAllById)



module.exports = router;