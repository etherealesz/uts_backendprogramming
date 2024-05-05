const bankAccountRepository = require('./onlinebank-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');


/**
 * Create new bank account number
 * @param {string} userId - User Id yang terhubung dengan id dari bank
 * @param {string} accountNumber - Account Number
 * @returns {Object}
 */
async function createBankAccount(userId, accountNumber) {
    try {
        var existingBankAccount = await bankAccountRepository.getBankAccountNumber(accountNumber);
        if (existingBankAccount) {
            return null;
        }
        return await bankAccountRepository.createBankAccount(userId, accountNumber)
    } catch (error) {
        throw new Error(error.message)
    }
}


/**
 * Gets all list of bank account by user id
 * @param {string} userId - User Id yang terhubung dengan id dari bank
 * @returns {Object}
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
 * @returns {Object}
 */
async function getTransactionHistory(accountNumber, userId) {
    try {
        var bankAccount = await bankAccountRepository.getBankAccountNumberAndUserId(accountNumber, userId);
        const transactionHistory = await bankAccountRepository.getTransactionHistory(bankAccount._id);
        return transactionHistory;
    } catch (error) {
        throw error;
    }
}

async function getBankAccountByAccountNumber(accountNumber, userId) {

    const bankAccounts = await bankAccountRepository.getBankAccountNumberAndUserId(accountNumber, userId);
    if (bankAccounts) {
        return bankAccounts;
    } else {
        return null;
    }
}

async function withdraw(bankAccounts, total) {
    try {
        bankAccounts.balance -= total;
        let responseTransactions = await bankAccountRepository.withdraw(bankAccounts, total);
        if (responseTransactions) {
            return responseTransactions;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}


async function getUserByEmail(email) {
    return await bankAccountRepository.getUserByEmail(email);
}

async function getBankAccountNumberAndUserId(accountNumber, userId) {
    return await bankAccountRepository.getBankAccountNumberAndUserId(accountNumber, userId);
}


async function transfer(bankAccounts, bankAccountUserDestination, total) {
    try {
        bankAccounts.balance -= total;
        bankAccountUserDestination.balance += total;

        var transactionHistory = await bankAccountRepository.transfer(bankAccounts, total);
        var bankAccountDestinationUpdated = await bankAccountRepository.update(bankAccountUserDestination);

        if (transactionHistory && bankAccountDestinationUpdated) {
            return transactionHistory;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

async function deposit(accountNumber, userId, amount) {
    var bankAccount = await bankAccountRepository.findByAccountNumber(accountNumber, userId);
    if (!bankAccount) {
        return null;
    }
    bankAccount.balance += amount;
    return bankAccountRepository.deposit(bankAccount, amount);
}

async function updateAccountNumber(accountNumber, newAccountNumber, userId) {
    
    let bankAccount = await bankAccountRepository.findByAccountNumber(accountNumber, userId);
    if (!bankAccount) {
        return null;
    }
    var existingBankAccount = await bankAccountRepository.getBankAccountNumber(newAccountNumber);
    if (existingBankAccount) {
        return false;
    }

    var existingBankAccount = await bankAccountRepository.getBankAccountNumber(newAccountNumber);
    if (existingBankAccount) {
        throw new Error('Nomor rekening sudah digunakan sebelumnya.')
    }

    bankAccount.accountNumber = newAccountNumber;
    return await bankAccountRepository.update(bankAccount);
}

async function deleteAccountNumber(accountNumber, userId) {
    let bankAccount = await bankAccountRepository.findByAccountNumber(accountNumber, userId);
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
    getBankAccountNumberAndUserId
}