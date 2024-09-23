const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: String,
    category: String,
    dueDate: Date,
    status: { type: String, default: 'pending' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', taskSchema);
