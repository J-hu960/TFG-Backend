const nodemailer = require('nodemailer')

const sendEmail=async(options)=>{
    //1-Create a transporter
   
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "15d89aeb5a709a",
          pass: "0e797ca58b5073"
        }
      });

    //2-Define the email options

    const mailOptions={
        from:'Jordi Salazar <jordi@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message,
        //html:
    }

    //3-Actually send the email
    await transport.sendMail(mailOptions)
}

module.exports=sendEmail