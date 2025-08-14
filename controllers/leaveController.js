const Leave = require('../models/Leave');

exports.createLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
      user: req.user._id,
      type, startDate, endDate, reason
    });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.myLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.pendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'Pending' }).populate('user', 'name email department').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    leave.status = 'Approved';
    leave.approver = req.user._id;
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    leave.status = 'Rejected';
    leave.approver = req.user._id;
    leave.comments = req.body.comments || '';
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
