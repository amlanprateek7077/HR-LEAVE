const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { createLeave, myLeaves } = require('../controllers/leaveController');

router.post('/', auth(), createLeave);
router.get('/my', auth(), myLeaves);

module.exports = router;
