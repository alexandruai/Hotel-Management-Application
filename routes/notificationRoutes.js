const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// Route to create a new notification
router.post('/addnotification', async (req, res) => {
  const { title, description, userId, userName, userType } = req.body;

  const newNotification = new Notification({
    title,
    description,
    userId,
    userName,
    userType
  });

  try {
    await newNotification.save();
    res.send('Notification added successfully');
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Route to fetch all notifications for a specific employee
router.get('/mynotifications/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId });
    res.send(notifications);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Get all notifications
router.get('/allnotifications', async (req, res) => {

  try {
    const notifications = await Notification.find({});
    res.send(notifications);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;