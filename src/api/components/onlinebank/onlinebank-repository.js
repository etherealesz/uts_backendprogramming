const { Transaction } = require('../../../models');
const { User } = require('../../../models');
const BankAccount = require('../../../models/bank-account');

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function createBankAccount(userId, accountNumber){
  return new BankAccount({userId: userId, accountNumber: accountNumber}).save();
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

async function findByAccountNumber(accountNumber, userId) {
  const bankAccount = await BankAccount.findOne({ accountNumber: accountNumber, userId: userId });
  return bankAccount;
}

async function topUp(accountId, amount) {
  try {
      // Temukan akun bank berdasarkan accountId
      const bankAccount = await BankAccount.findById(accountId);
      if (!bankAccount) {
          throw new Error('Akun bank tidak ditemukan');
      }
      bankAccount.balance += amount;
      console.log('success top up');

      await bankAccount.save();
      const topUpTransaction = new Transaction({
          accountId: accountId,
          type: 'topup',
          amount: amount
      });
      const newTransaction = await topUpTransaction.save();
      return newTransaction;
  } catch (error) {
      throw new Error('Gagal menambahkan transaksi top up: ' + error.message);
  }
}

async function withdraw(accountNumber, amount) {
  try {
      const bankAccount = await BankAccount.findOne({ accountNumber: accountNumber });
      if (!bankAccount) {
          throw new Error('Akun bank tidak ditemukan');
      }

      if (bankAccount.balance < amount) {
          throw new Error('Saldo tidak mencukupi untuk melakukan penarikan');
      }

      bankAccount.balance -= amount;
      console.log('success withdraw');

      await bankAccount.save();

      const withdrawTransaction = new Transaction({
          accountId: bankAccount._id,
          type: 'withdraw',
          amount: amount
      });
      const newTransaction = await withdrawTransaction.save();
      return newTransaction;
  } catch (error) {
      throw new Error('Gagal menambahkan transaksi penarikan: ' + error.message);
  }
}

async function transfer(bankAccount, amount) {
  await bankAccount.save();
  const withdrawTransaction = new Transaction({
      accountId: bankAccount._id,
      type: 'transfer',
      amount: amount
  });
  const newTransaction = await withdrawTransaction.save();
  return newTransaction;
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