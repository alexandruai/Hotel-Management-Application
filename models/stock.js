// models/stock.js
const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    measureUnit: {
        type: String
    },
    description: {
        type: String
    },
    history: [{
        action: { type: String, enum: ['ADAUGAT', 'STERS', 'UPDATAT'], required: true },
        quantity: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

const stockModel = mongoose.model('stocks', stockSchema);

module.exports = stockModel;
