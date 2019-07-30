require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

function sendSMS(data) {
    const phoneNumber = convertPhone(data.phonenumber);
    // send to customer
    client.messages.create({
        body: `Thank you for purchasing ${data.name}! Check your email, ${data.email} for more details. We will send you a reminder on the day of the event!`,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
    })
        .then(message => console.log(message.sid))
            .then(() => {
                // send to owner
                client.messages.create({
                    body: `A new customer has purchased the August 10th Slime Class. Check your email for details!`,
                    to: '+14158286841',
                    from: process.env.TWILIO_PHONE_NUMBER,
                }).then(message => console.log(message.sid))
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

}

const convertPhone = (phone) => {
    let result = '+1';

    let phoneSplit = phone.split('-');
    phoneSplit.forEach((set) => {
        result += set;
    })

    return result;
}

module.exports = {
    sendSMS,
};
