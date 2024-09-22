require("dotenv").config()
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const depositeRoutes = require('./routes/depositeRoutes');
const loanRoutes = require('./routes/loanRoutes');
const withDrawalRoutes = require('./routes/withDrawalRoutes');
const exchangeRoutes = require("./routes/exchangeRoutes")
const tradeRoutes = require('./routes/tradeRoutes')
const customDataRoutes = require('./routes/customDataRoutes')

const cors = require("cors");
const db = require('./config/DbConnection');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 5001;
const localIp = "0.0.0.0"
const cron = require('node-cron');
const path = require("path");

const port2 = 80;
const localIp2 = "0.0.0.0"

console.log(process.env.MONGODB_URI)


app.use(cors({origin:"*"}))

app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static("./files"))
app.use(express.static("./IDs"))

app.get('/ping', (req, res) => {
    res.send({status:200, message:"Hurray! Its working 💯 🚀"});
    console.log(req.headers)
})

// cron.schedule("1,2,3,4,5,****", ()=>{
//     console.log("CRON")
// })
// let number = 1
// cron.schedule('1 * * * * *', ()=>{
//     console.log("first", new Date())
//     number++
// })
// console.log(valid)


app.use("/user", userRoutes )
app.use("/deposit", depositeRoutes)
app.use("/loan", loanRoutes )
app.use("/withdrawal", withDrawalRoutes)
app.use("/exchange", exchangeRoutes)
app.use("/trade", tradeRoutes)
app.use("/data", customDataRoutes)




// app.use("/test",upload.any("media"), (req, res)=>{
//     console.log( "___________","REQ INN", req.body, "FILES,", req.files)
// })

app.use(express.static(path.join(__dirname, "web-build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "web-build/index.html"));
});

app.listen(port,localIp, (err)=>{
    db()
    if(err)console.log(err);
    console.log("🚀 backend listening  on ", port, "🔥")
})