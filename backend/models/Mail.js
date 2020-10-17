var nodemailer = require('nodemailer');

let credentials = require('../config')
//var smtpTransport = require('nodemailer-smtp-transport');

class Mail {

    constructor() {
        this.auth = credentials.auth
        this.host = credentials.mailHost
        this.service = credentials.mailService
        this.port = credentials.mailPort
    }

    sendMail = (options) => {

        const mailOptions = {
            from: `"Smart Note" <${this.auth.user}> `,
            to: options.toMail,
            subject: options.subject,
            html: options.html,
        };

        return new Promise((resolve,reject)=> {
            this.transporter = nodemailer.createTransport({
                host: this.host,
                service: this.service,
                secure: false,
                port: this.port,
                auth: this.auth,
            });

            this.transporter.sendMail(mailOptions, function(error, info){
                if (error) resolve(false);
                else resolve(true);
            })
        })
    }
}

module.exports = Mail
