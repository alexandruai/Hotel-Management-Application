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
        enum: ["LIBERA", "OCUPATA", "REZERVATA", "BLOCATA", "CURATA"],
        required: true,
        default: "LIBERA"
    },
    issues: [{
        description: { type: String, required: true },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        dateReported: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

const roomModel = mongoose.model('rooms', roomSchema);

module.exports = roomModel;