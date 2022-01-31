const express = require('express');
const router = express.Router();
const authentication = require('../utils/verifyToken');
const checksControllers = require('../controllers/checksControllers');

//get all checks the user created
router.get('/all-checks', authentication, checksControllers.getChecks);

//Create check
router.post('/create-check', authentication, checksControllers.creatCheck);

//Edit check
router.put('/:_id', authentication, checksControllers.editCheck);

//Delete the check
router.delete('/:_id', authentication, checksControllers.deleteCheck);

module.exports = router;
