const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'rooms' },
    roomName: { type: String, required: true },
    services: [{
        name: { type: String, required: true },
        cost: { type: Number, required: true }
    }],
    creationDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
