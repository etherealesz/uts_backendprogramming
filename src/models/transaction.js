// transaction-schema.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',
        required: true
    },
    type: {
        type: String,
        enum: ['transfer', 'topup', 'withdraw'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
  transactionSchema,
}