const express = require('express');
const router = express.Router();
const authentication = require('../utils/verifyToken');
const authControllers = require('../controllers/authControllers');

// register Users
router.post('/register', authentication, authControllers.registerUser);

//Login
router.post('/login', authControllers.login);

module.exports = router;
