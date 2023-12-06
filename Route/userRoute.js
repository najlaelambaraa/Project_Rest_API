const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/userController');
const checkTokenMw = require('../Middleware/checkToken');
router.get('/users',UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.get('/users/:id',UserController.getUserById);
router.put('/users/:id',checkTokenMw,UserController.updateUserById);
module.exports = router;
