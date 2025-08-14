const mongoose = require('mongoose');
const { Schema } = mongoose;

const LeaveSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Sick', 'Casual', 'Earned', 'Maternity', 'Paternity', 'Other'], default: 'Other' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approver: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);
