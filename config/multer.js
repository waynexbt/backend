const fs = require("fs")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(!fs.existsSync("files")){
            fs.mkdirSync("files")
            cb(null, "./files")
        }
        cb(null, "./files")
    }, 
    filename: function(req, file, cb){
        // for(let i = 0; i < file.length; i++){
        try{
            const fileName = Date.now() + file.originalname
            console.log("INSIDE MULTER FNC",fileName)
        cb(null,  fileName)

        }catch(e){ console.log(e)}
    }
})

const upload = multer({storage: storage})
module.exports = upload