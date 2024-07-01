const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    roomName: { type: String, required: true },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],
    totalAmount: { type: Number, required: true },
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;