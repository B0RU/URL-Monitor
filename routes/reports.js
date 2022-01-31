const router = require('express').Router();
const authentication = require('../utils/verifyToken');
const reportControllers = require('../controllers/reportControllers');

// GET report
router.get('/:checkId', authentication, reportControllers.getReports);

module.exports = router;
