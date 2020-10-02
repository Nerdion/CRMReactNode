const express = require('express');
const api = express.Router();
const mailcontroller = require('../controllers/MailController');
const userController = require('../controllers/UserController');

//mail api's
 api.use('/api/sendmail', mailcontroller.sendMail);
 api.use('/auth/login', userController.login);
 api.use('/auth/register', userController.register);

module.exports = api;