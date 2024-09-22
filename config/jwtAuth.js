const jwt = require('jsonwebtoken');
const secret = "secret";

const isAdmin =(req, res, next)=>{
    try{
        if(req.body.user.role === 'admin'){
            next()
        }else{
            res.send({status: 401, message:"No Access"})
        }
    }catch(error){
        res.send({status: 401, message:"ERROR IN REQUEST", error: error})
    }
}

const generateToken = (data) => {
    try{
       return jwt.sign(data, secret)
    }catch(e){
        return e;
    }
}

const authVerification = (req, res, next) =>{
    console.log("HEADERRRR",req.headers.authorization.split(" ")[1])
    if(req.headers.authorization){
        try{
            const jwtVerification = jwt.verify(req.headers.authorization.split(" ")[1], secret)
            if(jwtVerification){
                next();
            }else{
            res.send({status:401, message:"Invalid token", jwtVerification})
            }
        }catch(error){
            res.send({status:401, message:error?.message, error})
        }
    }else{
        res.send({status:401, message:"Token is missing"})
    }
}

module.exports = {generateToken, authVerification, isAdmin};