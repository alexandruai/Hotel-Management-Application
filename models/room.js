const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    maxcount: {
        type: Number,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    rentperday: {
        type: Number,
        required: true
    },
    imageurls: [],
    currentbookings: [],
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["LIBERA", "OCUPATA", "REZERVATA", "BLOCATA", "CURATENIE"],
        required: true,
        default: "LIBERA"
    },
    issues: [{
        description: { type: String, required: true },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        dateReported: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false }
    }],
    history: [{
        action: { type: String, enum: ['CHECK IN', 'CHECK OUT', 'CURATENIE'], required: true },
        clientName: { type: String, required: true },
        clientEmail: { type: String, required: true },
        userType: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

const roomModel = mongoose.model('rooms', roomSchema);

module.exports = roomModel;