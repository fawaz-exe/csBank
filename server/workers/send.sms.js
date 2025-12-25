import twilio from 'twilio';

import dotenv from 'dotenv'
dotenv.config()

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER
const client = twilio(accountSID, authToken)

async function sendSMS({to, body}) {
    try {
        if(!to) {throw new Error("SMS 'to' is missing")}

        const message = await client.messages.create({
            to,
            body,
            from: twilioPhone,
        });
        console.log("SMS sent", message.sid);
    } catch (error) {
        console.log(error.message);
    }
}

export default sendSMS;