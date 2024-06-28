const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    services: [{
        name: { type: String, required: true },
        cost: { type: Number, required: true }
    }]
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
