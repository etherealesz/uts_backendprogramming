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
            throw new Error('Nomor rekening sudah digunakan sebelumnya.')
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
        const bankAccounts = await bankAccountRepository.getBankAccountByUserId(userId);
        return bankAccounts;
    }
    catch (error) {
        throw errorResponder(
            errorTypes.BAD_REQUEST, 'Bad request',
            error.message
        )
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
        throw errorResponder(
            errorTypes.NOT_FOUND,
            error
        );
    }
}

async function getBankAccountByAccountNumber(accountNumber, userId) {

    const bankAccounts = await bankAccountRepository.getBankAccountNumberAndUserId(accountNumber, userId);
    if (bankAccounts) {
        return bankAccounts;
    } else {
        throw errorResponder(
            errorTypes.NOT_FOUND,
            "Bank account not found!"
        );
    }
}

async function withdraw(accountNumber, userId, total) {
    try {
        const bankAccounts = await bankAccountRepository.getByAccountNumberAndUserId(accountNumber, userId);

        if (!bankAccounts) {
            throw errorResponder(
                errorTypes.NOT_FOUND,
                "Bank account not found / The account you wanted to withdraw from is not your account!"
            );
        }

        if (bankAccounts.balance < total) {
            throw errorResponder(
                errorTypes.BAD_REQUEST,
                "Balance is not enough"
            );
        }
        // update balance in bank account
        bankAccounts.balance -= total;
        let responseTransactions = await bankAccountRepository.withdraw(bankAccounts, total);
        return responseTransactions;
    } catch (error) {
        throw errorResponder(///
            errorTypes.BAD_REQUEST,
            error.message
        );
    }
}


async function transfer(accountNumber, accountNumberDestination, userId, total, email) {
    try {
        const user = await bankAccountRepository.getUserByEmail(email);
        if (!user) {
            throw errorResponder(
                errorTypes.NOT_FOUND,
                "User destination is not found!"
            );
        }
        if (user._id == userId) {
            throw errorResponder(
                errorTypes.BAD_REQUEST,
                "You can't transfer to yourself."
            );
        }
        const bankAccounts = await bankAccountRepository.getBankAccountNumberAndUserId(accountNumber, userId);
        const bankAccountUserDestination = await bankAccountRepository.getBankAccountNumberAndUserId(accountNumberDestination, user._id);

        if (!bankAccounts) {
            throw errorResponder(///
                errorTypes.NOT_FOUND,
                "User bank account not found!"
            );
        }
        if (!bankAccountUserDestination) {
            throw errorResponder(///
                errorTypes.NOT_FOUND,
                "User Bank Account destination not found!"
            );
        }
        // apakah total yang dikirim kurang = 0
        if (total <= 0) {
            throw errorResponder(///
                errorTypes.BAD_REQUEST,
                "Total must be greater than 0!"
            );
        }
        // cek kecukupan saldo
        if (bankAccounts.balance < total) {
            throw errorResponder(
                errorTypes.BAD_REQUEST,
                "Your balance is insufficient!"
            );
        }

        bankAccounts.balance -= total;
        bankAccountUserDestination.balance += total;

        var transactionHistory = await bankAccountRepository.transfer(bankAccounts, total);
        var bankAccountDestinationUpdated = await bankAccountRepository.update(bankAccountUserDestination);

        if (transactionHistory && bankAccountDestinationUpdated) {
            return transactionHistory;
        } else {
            throw errorResponder(
                errorTypes.BAD_REQUEST,
                "Transfer failed"
            );
        }
    } catch (error) {
        throw error;
    }
}

async function deposit(accountNumber, userId, amount) {
    var bankAccount = await bankAccountRepository.findByAccountNumber(accountNumber, userId);
    if (!bankAccount) {
        throw errorResponder(
            errorTypes.NOT_FOUND,
            "Bank account not found / The account you wanted to topup for is not your account!"
        );
    }
    bankAccount.balance += amount;
    return bankAccountRepository.topUp(bankAccount, amount);
}

async function updateAccountNumber(accountNumber, newAccountNumber, userId) {
    
    let bankAccount = await bankAccountRepository.findByAccountNumber(accountNumber, userId);
    if (!bankAccount) {
        throw errorResponder(
            errorTypes.NOT_FOUND,
            "Bank account not found"
        );
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
        throw errorResponder(
            errorTypes.NOT_FOUND,
            "Bank account not found!"
        );
    }
    await bankAccount.deleteOne();
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
}

