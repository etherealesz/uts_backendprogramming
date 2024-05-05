const { Transaction } = require('../../../models');
const { User } = require('../../../models');
const { BankAccount } = require('../../../models');

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Creates a new bank account (bank account)
 * @param {string} accountNumber - Account Number
 * @param {string} userId - User Id connected to bank Id
 * @returns {Promise}
 */
async function createBankAccount(userId, accountNumber) {
  return new BankAccount({
    userId: userId,
    accountNumber: accountNumber,
  }).save();
}

/**
 * Get user by email to prevent duplicate
 * @param {string} accountNumber - Account Number
 * @param {string} userId - User Id connected to bank Id
 * @returns {Promise}
 */
async function getBankAccountNumberAndUserId(accountNumber, userId) {
  return await BankAccount.findOne({
    accountNumber: accountNumber,
    userId: userId,
  });
}

/**
 * Get bank account number by account number to prevent duplicate
 * @param {string} accountNumber - Account Number
 * @returns {Promise}
 */
async function getBankAccountNumber(accountNumber) {
  return await BankAccount.findOne({ accountNumber: accountNumber });
}

/**
 * Get user by email to prevent duplicate
 * @param {string} userId - User Id connected to bank Id
 * @returns {Promise}
 */
async function getBankAccountByUserId(userId) {
  return await BankAccount.find({ userId: userId });
}

/**
 * Get transactions history of an account id
 * @param {string} accountId - Account Id made from making bank account
 * @returns {Promise}
 */
async function getTransactionHistory(accountId) {
  return await Transaction.find({ accountId: accountId });
}

/**
 * Get transactions history of an account id
 * @param {string} accountId - Account Id made from making bank account
 * @returns {Promise}
 */
async function findByAccountNumber(accountNumber, userId) {
  return await BankAccount.findOne({
    accountNumber: accountNumber,
    userId: userId,
  });
}

/**
 * Deposits money to a bank account
 * @param {string} bankAccount - Bank Account
 * @param {number} amount - Amount
 * @returns {Promise}
 */
async function deposit(bankAccount, amount) {
  try {
    await bankAccount.save();
    return await new Transaction({
      accountId: bankAccount._id,
      type: 'deposit',
      amount: amount,
    }).save();
  } catch (error) {
    throw new Error('Gagal menambahkan transaksi deposit: ' + error.message);
  }
}

/**
 * Withdraw money from a bank account
 * @param {string} bankAccount - Bank Account
 * @param {number} amount - Amount
 * @returns {Promise}
 */
async function withdraw(bankAccount, amount) {
  try {
    await bankAccount.save();
    return await Transaction({
      accountId: bankAccount._id,
      type: 'withdraw',
      amount: amount,
    }).save();
  } catch (error) {
    throw new Error('Gagal menambahkan transaksi penarikan: ' + error.message);
  }
}

/**
 * Withdraw money from a bank account
 * @param {string} bankAccount - Bank Account
 * @param {number} amount - Amount
 * @returns {Promise}
 */
async function transfer(bankAccount, amount) {
  await bankAccount.save();
  return new Transaction({
    accountId: bankAccount._id,
    type: 'transfer',
    amount: amount,
  }).save();
}

/**
 * Updates account number
 * @param {string} bankAccount - Bank Account
 * @returns {Promise}
 */
async function update(bankAccount) {
  return await bankAccount.save();
}

module.exports = {
  createBankAccount,
  getBankAccountNumber,
  getBankAccountNumberAndUserId,
  getBankAccountByUserId,
  getTransactionHistory,
  getUserByEmail,
  findByAccountNumber,
  deposit,
  withdraw,
  update,
  transfer,
};
