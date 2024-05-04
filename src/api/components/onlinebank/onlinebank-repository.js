const { Transaction } = require('../../../models');
const { User } = require('../../../models');
const { BankAccount } = require('../../../models');

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function createBankAccount(userId, accountNumber) {
  return new BankAccount({ userId: userId, accountNumber: accountNumber }).save();
}

async function getBankAccountNumberAndUserId(accountNumber, userId) {
  return await BankAccount.findOne({ accountNumber: accountNumber, userId: userId });
}

async function getBankAccountByUserId(userId) {
  return await BankAccount.find({ userId: userId });
}

async function getTransactionHistory(accountId) {
  return await Transaction.find({ accountId: accountId });
}

async function findByAccountNumber(accountNumber, userId) {
  return await BankAccount.findOne({ accountNumber: accountNumber, userId: userId });
}

async function topUp(bankAccount, amount) {
  try {
    await bankAccount.save();
    return await new Transaction({
      accountId: bankAccount._id,
      type: 'topup',
      amount: amount
    }).save();
  } catch (error) {
    throw new Error('Gagal menambahkan transaksi top up: ' + error.message);
  }
}

async function withdraw(bankAccount, amount) {
  try {
    await bankAccount.save();
    return await Transaction({
      accountId: bankAccount._id,
      type: 'withdraw',
      amount: amount
    }).save();
  } catch (error) {
    throw new Error('Gagal menambahkan transaksi penarikan: ' + error.message);
  }
}

async function transfer(bankAccount, amount) {
  await bankAccount.save();
  return new Transaction({
    accountId: bankAccount._id,
    type: 'transfer',
    amount: amount
  }).save();
}


async function update(bankAccount) {
  return await bankAccount.save();
}


module.exports = {
  createBankAccount,
  getBankAccountNumberAndUserId,
  getBankAccountByUserId,
  getTransactionHistory,
  getUserByEmail,
  findByAccountNumber,
  topUp,
  withdraw,
  update,
  transfer,
}