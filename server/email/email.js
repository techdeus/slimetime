require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const Moment = require('moment');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmails(data) {
    const msgToCustomer = {
        to: {
           name: data.name,
           email: data.email, 
        },
        from: 'sullivan.marlon@gmail.com',
        replyTo: 'sullivan.marlon@gmail.com',
        templateId: 'd-27a05861c64e49ce8ce125bbe4f5bfd4',
        dynamic_template_data: {
            name: data.name,
            date: Moment(data.event.startdate).format('dddd MM-DD-YYYY'),
            time: `${Moment(data.event.startdate).format('hh:mm a')} to ${Moment(data.event.enddate).format('hh:mm a')} `,
            address: data.event.address,
        },
    };

    const msgToOwner = {
        to: {
            name: 'Owner',
            email: 'sullivan.marlon@gmail.com', 
         },
        from: 'sullivan.marlon@gmail.com',
        templateId: 'd-9f821752501746c2abeddd205d64f38d',
        dynamic_template_data: {
            name: data.name,
            email: data.email,
            phonenumber: data.phonenumber,
            numofchildren: data.values.length,
            paid: data.values.length * 15,
            children: data.values,
        },
    };

    try {
        let toCustomer = await sgMail.send(msgToCustomer);
        let toOwner = await sgMail.send(msgToOwner);
        console.log('Email was sent');
    } catch (err) {
        console.log(err);
    }
};







module.exports = {
    sendEmails,
}
