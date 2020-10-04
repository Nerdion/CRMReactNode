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

    sendMail = (options, res) => {

        const mailOptions = {
            from: '"DevLinkLabs" <devlinklabs@gmail.com>',
            to: options.toMail,
            subject: options.subject,
            text: options.text,
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.json({ "success": false, "error": error.toString(), "Payload": [] })
            } else {
                res.json({ "sucess": true, "message": info.response})
            }
        });
    }
}

module.exports = Mail