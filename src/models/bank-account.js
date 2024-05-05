// bank-account-model.js
const { default: mongoose } = require("mongoose");

const bankAccountSchema = {
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
};

module.exports = bankAccountSchema;
