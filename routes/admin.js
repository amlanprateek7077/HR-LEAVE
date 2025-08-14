const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { pendingLeaves, approveLeave, rejectLeave } = require('../controllers/leaveController');

router.get('/leaves/pending', auth('admin'), pendingLeaves);
router.patch('/leaves/:id/approve', auth('admin'), approveLeave);
router.patch('/leaves/:id/reject', auth('admin'), rejectLeave);

module.exports = router;
