const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // s-ar putea sa trebuiasca sa treci camp 
  // assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('notifications', notificationSchema);