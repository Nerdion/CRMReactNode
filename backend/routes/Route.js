const express = require('express');
const api = express.Router();
const mailcontroller = require('../controllers/MailController');
const userController = require('../controllers/UserController');
const organizationController = require('../controllers/OrganizationController');
const workspaceController = require('../controllers/WorkspaceController');
const taskController = require('../controllers/TaskController');

//mail api's
 api.use('/api/sendmail', mailcontroller.sendMail);

 api.use('/auth/login', userController.login);
 api.use('/auth/register', userController.register);

 api.use('/api/organisation', organizationController.manage);

 api.use('/api/manageUser', userController.manageUser);

 api.use('/api/workspaceAction', workspaceController.workspaceAction);

 api.use('/api/taskAction', taskController.taskAction);
module.exports = api;