const express = require('express');
const api = express.Router();
const mailcontroller = require('../controllers/MailController');
const userController = require('../controllers/UserController');
const organizationController = require('../controllers/OrganizationController')

//mail api's
 api.use('/api/sendmail', mailcontroller.sendMail);

 api.use('/auth/login', userController.login);
 api.use('/auth/register', userController.register);

 api.use('/api/organisation', organizationController.manage);

 api.use('/api/manageUser', userController.manageUser);

module.exports = api;