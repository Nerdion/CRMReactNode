var nodemailer = require('nodemailer');

//var smtpTransport = require('nodemailer-smtp-transport');

class Mail {

    constructor() {
        this.auth = {
            user: 'shriyashshingare@yahoo.com',
            pass: 'wdsurjybgdcdypct',
        }
        this.host = 'smtp.mail.yahoo.com'
        this.service = 'yahoo',
            this.port = 465,

            this.transporter = nodemailer.createTransport({
                host: this.host,
                service: this.service,
                secure: false,
                port: this.port,
                auth: this.auth,
                debug: true,
                logger: true
            });
    }

    sendMail = (options) => {

        const mailOptions = {
            from: '"Smart Note" <shriyashshingare@yahoo.com>',
            to: options.toMail,
            subject: options.subject,
            text: options.text,
        };
        let isSend = true
        let promise = new Promise(function (resolve, reject) {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    isSend = false
                    console.log(error)
                }
                resolve(info);
            });
        });

        return promise;
    }
}

module.exports = Mail

async function wrapedSendMail(mailOptions){
    return new Promise((resolve,reject)=>{
    let transporter = nodemailer.createTransport({//settings});

 transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log("error is "+error);
       resolve(false); // or use rejcet(false) but then you will have to handle errors
    } 
   else {
       console.log('Email sent: ' + info.response);
       resolve(true);
    }
   });
   }
  