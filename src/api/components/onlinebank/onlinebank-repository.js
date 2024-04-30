const { Transaction } = require('../../../models');
const { BankAccount } = require('../../../models');
const { User } = require('../../../models');

async function createBankAccount(userId, accountNumber){
  return new BankAccount({userId: userId, accountNumber: accountNumber}).save();
}

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function getBankAccountNumberAndUserId(accountNumber, userId){
  return await BankAccount.findOne({ accountNumber: accountNumber, userId: userId });
}

async function getBankAccountByUserId(userId){
  return await BankAccount.find({userId: userId});
}

async function getTransactionHistory(accountId){
  return await Transaction.find({accountId: accountId});
}

async function getAccountNumber(accountNumber, userId){
  return await BankAccount.findOne({ accountNumber: accountNumber, userId: userId });
}

async function findByAccountNumber(accountNumber, userId) {
      return await BankAccount.findOne({ accountNumber: accountNumber, userId: userId });
}


module.exports = {
  createBankAccount,
  getBankAccountNumberAndUserId,
  getBankAccountByUserId,
  getTransactionHistory,
  getAccountNumber,
  getUserByEmail,
  findByAccountNumber,
}