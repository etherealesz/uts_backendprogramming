// transaction-schema.js
const { default: mongoose } = require('mongoose');

const transactionSchema = {
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',
        required: true
    },
    type: {
        type: String,
        enum: ['transfer', 'deposit', 'withdraw'],
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
};

module.exports = transactionSchema;