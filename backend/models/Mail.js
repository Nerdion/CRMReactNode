var nodemailer = require('nodemailer');

//var smtpTransport = require('nodemailer-smtp-transport');

class Mail {

    constructor() {
        this.auth = {
            user: 'shriyashshingare@yahoo.com',
            pass: 'wdsurjybgdcdypct',
        }
        this.host = 'smtp.mail.yahoo.com'
        this.service = 'yahoo'
        this.port = 465
    }

    sendMail = (options) => {

        const mailOptions = {
            from: '"Smart Note" <shriyashshingare@yahoo.com>',
            to: options.toMail,
            subject: options.subject,
            text: options.text,
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
