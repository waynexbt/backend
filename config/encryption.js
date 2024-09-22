const bcrypt = require('bcrypt');
const salt = 10;

const encryptPass = async (req, res, next) =>{
    try{

       const hashedPassword = await bcrypt.hash(req.body.password, salt )
       console.log("IN FUNCCC", hashedPassword)
       req.body.password = hashedPassword

       next()
    }catch(err){
        console.log(err)
    }
}


module.exports = {encryptPass}