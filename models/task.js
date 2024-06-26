const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['IN ASTEPTARE', 'IN CURS DE REZOLVARE', 'COMPLET'], default: 'IN ASTEPTARE' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateAssigned: { type: Date, default: Date.now },
    dateCompleted: { type: Date }
}, {
    timestamps: true,
});

module.exports = mongoose.model('tasks', taskSchema);