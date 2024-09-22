const sgMail = require('@sendgrid/mail')


const sendEmail = (data)=>{
    console.log("DATA IN SENDER", data)
    sgMail.setApiKey(process.env.SENDGRID_API)
    const OTP = "SOMTHIGNGNNGNGNG"
    const message = {
        to : "mirzazeeshan3738533@gmail.com",
        from: {
        name:"LEAD CENTER",
        email:"leads.centerr@gmail.com",
        },
        reply_to:"umerhayat588@gmail.com",
        subject: "OTP for verification",
        text: `HERE ARE SOME TXT ${data?.otp} `
        
    }
    
    sgMail.send(message).then((response) => console.log('email send....', response)).catch((error) => {
        console.log("IN CATCHHH", data)
        sendEmail(data)
    })
}

module.exports = sendEmail;