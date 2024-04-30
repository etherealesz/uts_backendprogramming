// bank-account-model.js
const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});


const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;
