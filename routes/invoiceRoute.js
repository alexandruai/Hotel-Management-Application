const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');
const Request = require('../models/request');
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.post('/createinvoice', async (req, res) => {
    const { clientName, clientEmail, roomName, requests } = req.body;

    try {
        // Fetch the full request objects from the database using the request IDs
        const fullRequests = await Request.find({ _id: { $in: requests } }).populate('room');
        console.log("Request Found ",fullRequests )

        // Calculate total amount based on request costs
        const totalAmount = fullRequests.reduce((total, request) => {
            const requestTotal = request.services.reduce((subtotal, service) => {
                const serviceCost = parseFloat(service.cost || 0);
                console.log(`Adding service cost: ${serviceCost}`);
                return subtotal + serviceCost;
            }, 0);
            console.log(`Request total: ${requestTotal}`);
            return total + requestTotal;
        }, 0);
        console.log(`Total amount: ${totalAmount}`);

        // Create and save the new invoice
        const newInvoice = new Invoice({
            clientName, 
            clientEmail,
            roomName,
            requests, 
            totalAmount
        });
        console.log(`New Invoice: ${newInvoice}`);
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

// Download invoice as PDF
router.get('/downloadinvoice/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).send('Invoice not found');

        const doc = new PDFDocument();
        const filename = `invoice-${invoice._id}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);
        doc.fontSize(16).text(`Invoice for ${invoice.clientName}`, { align: 'center' });
        doc.text(`Client Email: ${invoice.clientEmail}`);
        doc.text(`Room: ${invoice.roomName}`);
        doc.text(`Total Amount: $${invoice.totalAmount}`);
        doc.text('Requests:');
        invoice.requests.forEach(requestId => {
            doc.text(`- ${requestId}`);
        });

        doc.end();
        console.log("Document ", doc)
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
