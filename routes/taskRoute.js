const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');

// Admin views all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create a new task
router.post('/tasks', async (req, res) => {
    const { description, assignedTo, createdBy } = req.body;

    try {
        const newTask = new Task({ description, assignedTo, createdBy });
        await newTask.save();
        res.send('Task created successfully');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Employee views their tasks
router.get('/tasks/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Convert userId to ObjectId
       const objectId = new mongoose.Types.ObjectId(userId);
        const tasks = await Task.find({ assignedTo: userId });
        res.send(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task status
router.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        task.status = status;
        if (status === 'COMPLET') {
            task.dateCompleted = Date.now();
        }
        await task.save();
        res.send('Task updated successfully');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/tasks/reportissue', async (req, res) => {
    const { description } = req.body;

    try {
        // Logic to notify manager and assign task to appropriate employees
        const manager = await User.findOne({ type: 'manager' }); // Assuming 'manager' type exists
        const issueTask = new Task({
            description,
            assignedTo: manager._id, // Assign issue task to manager
            createdBy: req.user._id // Assuming user is authenticated and assigned to this task
        });
        await issueTask.save();

        res.send('Issue reported successfully');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create a new task
router.post('/tasks', async (req, res) => {
    const { description, assignedTo, createdBy } = req.body;

    try {
        const newTask = new Task({ description, assignedTo, createdBy });
        await newTask.save();
        res.send('Task created successfully');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;