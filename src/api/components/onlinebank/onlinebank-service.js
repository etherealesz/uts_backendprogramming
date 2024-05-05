const bankAccountRepository = require('./onlinebank-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Create new bank account number
 * @param {string} userId - User Id yang terhubung dengan id dari bank
 * @param {string} accountNumber - Account Number
 * @returns {Promise}
 */
async function createBankAccount(userId, accountNumber) {
  try {
    var existingBankAccount =
      await bankAccountRepository.getBankAccountNumber(accountNumber);
    if (existingBankAccount) {
      return null;
    }
    return await bankAccountRepository.createBankAccount(userId, accountNumber);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Gets all list of bank account by user id
 * @param {string} userId - User Id yang terhubung dengan id dari bank
 * @returns {object}
 */
async function getBankAccountByUserId(userId) {
  try {
    return await bankAccountRepository.getBankAccountByUserId(userId);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Gets all list of transaction history by account number
 * @param {string} accountNumber - Account Number
 * @param {string} userId - User Id (Connected to the bank)
 * @returns {object}
 */
async function getTransactionHistory(accountNumber, userId) {
  try {
    var bankAccount = await bankAccountRepository.getBankAccountNumberAndUserId(
      accountNumber,
      userId
    );
    const transactionHistory =
      await bankAccountRepository.getTransactionHistory(bankAccount._id);
    return transactionHistory;
  } catch (error) {
    throw error;
  }
}

/**
 * Gets bank account using account number
 * @param {string} accountNumber - Account Number
 * @param {string} userId - User Id (Connected to the bank)
 * @returns {Object}
 */
async function getBankAccountByAccountNumber(accountNumber, userId) {
  const bankAccounts =
    await bankAccountRepository.getBankAccountNumberAndUserId(
      accountNumber,
      userId
    );
  if (bankAccounts) {
    return bankAccounts;
  } else {
    return null;
  }
}

/**
 * Withdraws money from bank account
 * @param {string} bankAccounts - Bank Account
 * @param {string} total - Total
 * @returns {boolean}
 */
async function withdraw(bankAccounts, total) {
  try {
    bankAccounts.balance -= total;
    let responseTransactions = await bankAccountRepository.withdraw(
      bankAccounts,
      total
    );
    if (responseTransactions) {
      return responseTransactions;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Gets user email
 * @param {string} email - Email
 * @returns {object}
 */
async function getUserByEmail(email) {
  return await bankAccountRepository.getUserByEmail(email);
}

/**
 * Gets all list of transaction history by account number
 * @param {string} accountNumber - Account Number
 * @param {string} userId - User Id (Connected to the bank)
 * @returns {Object}
 */
async function getBankAccountNumberAndUserId(accountNumber, userId) {
  return await bankAccountRepository.getBankAccountNumberAndUserId(
    accountNumber,
    userId
  );
}

/**
 * Transfers money from an account to another account
 * @param {string} accountNumber - Account Number
 * @param {string} userId - User Id (Connected to the bank)
 * @returns {Object}
 */
async function transfer(bankAccounts, bankAccountUserDestination, total) {
  try {
    bankAccounts.balance -= total;
    bankAccountUserDestination.balance += total;

    var transactionHistory = await bankAccountRepository.transfer(
      bankAccounts,
      total
    );
    var bankAccountDestinationUpdated = await bankAccountRepository.update(
      bankAccountUserDestination
    );

    if (transactionHistory && bankAccountDestinationUpdated) {
      return transactionHistory;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Transfers money from an account to another account
 * @param {string} accountNumber - Account Number
 * @param {string} userId - User Id (Connected to the bank)
 * @param {string} amount - Amount
 * @returns {Object}
 */
async function deposit(accountNumber, userId, amount) {
  var bankAccount = await bankAccountRepository.findByAccountNumber(
    accountNumber,
    userId
  );
  if (!bankAccount) {
    return null;
  }
  bankAccount.balance += amount;
  return bankAccountRepository.deposit(bankAccount, amount);
}

/**
 * Updates account number
 * @param {string} accountNumber - Account Number
 * @param {string} newAccountNumber - New account number
 * @param {string} userId - User Id
 * @returns {Promise}
 */
async function updateAccountNumber(accountNumber, newAccountNumber, userId) {
  let bankAccount = await bankAccountRepository.findByAccountNumber(
    accountNumber,
    userId
  );
  if (!bankAccount) {
    return null;
  }
  var existingBankAccount =
    await bankAccountRepository.getBankAccountNumber(newAccountNumber);
  if (existingBankAccount) {
    return false;
  }

  var existingBankAccount =
    await bankAccountRepository.getBankAccountNumber(newAccountNumber);
  if (existingBankAccount) {
    throw new Error('Nomor rekening sudah digunakan sebelumnya.');
  }

  bankAccount.accountNumber = newAccountNumber;
  return await bankAccountRepository.update(bankAccount);
}

/**
 * Deletes a bank account (Account number)
 * @param {string} accountNumber - Account Number
 * @param {string} userId - User Id (Connected to the bank)
 * @returns {boolean}
 */
async function deleteAccountNumber(accountNumber, userId) {
  let bankAccount = await bankAccountRepository.findByAccountNumber(
    accountNumber,
    userId
  );
  if (!bankAccount) {
    return false;
  }
  await bankAccount.deleteOne();
  return true;
}

module.exports = {
  createBankAccount,
  getBankAccountByUserId,
  getBankAccountByAccountNumber,
  getTransactionHistory,
  withdraw,
  deposit,
  transfer,
  updateAccountNumber,
  deleteAccountNumber,
  getUserByEmail,
  getBankAccountNumberAndUserId,
};
