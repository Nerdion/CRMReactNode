var nodemailer = require('nodemailer');

//var smtpTransport = require('nodemailer-smtp-transport');

class Mail {

    constructor() {
        this.auth = {
            user: 'devlinklabs@gmail.com',
            pass: 'L3FQRGVieXN1Tk1Pdz09',
        }
        this.host = 'smtp.gmail.com'
        this.service = 'gmail'

        this.transporter = nodemailer.createTransport({
            host: this.host,
            service: this.service,
            auth: this.auth,
        });
    }

    sendMail = (options) => {

        const mailOptions = {
            from: '"DevLinkLabs" <devlinklabs@gmail.com>',
            to: options.toMail,
            subject: options.subject,
            text: options.text,
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error)
        });
    }
}

module.exports = Mail