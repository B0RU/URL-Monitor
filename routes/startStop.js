const router = require('express').Router();
const authentication = require('../utils/verifyToken');
const startStopController = require('../controllers/startStopController');

router.put('/:_id', startStopController.startStop);

module.exports = router;
