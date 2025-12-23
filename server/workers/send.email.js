import dotenv from 'dotenv'
dotenv.config();
import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API)

async function sendEmail(emaildata){
    const {data, error} = await resend.emails.send({
        from: "email@0code.in",
        to: emaildata.to,
        subject: emaildata.subject,
        html: emaildata.body
    });
    if(error){
        console.log(error);
    }
    console.log("Email sent", data);
}

export default sendEmail;