const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const transactionSchema = require('./transaction');
const bankAccountSchema = require('./bank-account')

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Transaction = mongoose.model('Transaction', mongoose.Schema(transactionSchema, { versionKey: false }));
const BankAccount = mongoose.model('BankAccount', mongoose.Schema(bankAccountSchema, { versionKey: false }));

module.exports = {
  mongoose,
  User,
  BankAccount,
  Transaction,
};
