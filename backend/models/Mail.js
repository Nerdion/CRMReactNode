
let credentials = require('../config')
//var smtpTransport = require('nodemailer-smtp-transport');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(credentials.SENDGRID_API_KEY)

class Mail {

    constructor() {
        this.auth = credentials.auth
    }

    sendMail = (options) => {

        const mailOptions = {
            from: `Smart Train Onboard <${this.auth.user}> `,
            to: options.toMail,
            subject: options.subject,
            html: options.html,
        };

        return new Promise((resolve,reject)=> {
            sgMail
            .send(mailOptions)
            .then(() => {
                resolve(true)
            })
            .catch((error) => {
                console.log(error.toString())
                resolve(false)
            })
        })
    }
}

module.exports = Mail