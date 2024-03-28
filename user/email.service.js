import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "f7b32c10a250c7",
    pass: "f7f9e040104d0d",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendEmailOTP = async (firstName, otp) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "nepalmart@gmail.com", // sender address
    to: "jotofob572@mnsaf.com", // list of receivers
    subject: "Reset password otp", // Subject line
    // text: "Hello world?", // plain text body
    html: `<div style="box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;padding:1rem;">
    <h3>Reset password otp</h3>
   <br/> 
   <p>Dear ${firstName},</p>
   <br/>
   <p>Your otp for nepal mart app is <span style="font-weight:bold;"
   > ${otp}.</span> </p>
   <img style="height:100px; width:100px;" src="https://cdn.pixabay.com/photo/2017/03/16/21/18/logo-2150297_640.png"/>
   <p> If you did not request to change password, you can ignore this message.</p>
    </div>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};
