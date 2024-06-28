const express = require('express');
const router = express.Router();
const Request = require('../models/request');

// Create a new request
router.post('/createrequest', async (req, res) => {
    const { clientName, clientEmail, room, services } = req.body;

    try {
        const newRequest = new Request({ clientName, clientEmail, room, services });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all requests
router.get('/getallrequests', async (req, res) => {
    try {
        const requests = await Request.find({});
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
