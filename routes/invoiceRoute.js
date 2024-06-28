const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');

// Create a new invoice
router.post('/createinvoice', async (req, res) => {
    const { clientName, clientEmail, requests } = req.body;

    // Calculate total amount based on request costs
    const totalAmount = requests.reduce((total, request) => {
        return total + request.services.reduce((subtotal, service) => subtotal + service.cost, 0);
    }, 0);

    try {
        const newInvoice = new Invoice({ clientName, clientEmail, requests, totalAmount });
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all invoices
router.get('/getallinvoices', async (req, res) => {
    try {
        const invoices = await Invoice.find({});
        res.send(invoices);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;