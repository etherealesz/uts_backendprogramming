const bankAccountRepository = require('./onlinebank-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');
const BankAccount = require('../../../models/bank-account');
const { getUserByEmail } = require('../authentication/authentication-repository');

async function createBankAccount(userId, accountNumber) {
    try {
        const existingBankAccount = await BankAccount.findOne({ accountNumber: accountNumber });
        if (existingBankAccount) {
            throw new Error('Nomor rekening sudah digunakan sebelumnya.')
        }
        return await bankAccountRepository.createBankAccount(userId, accountNumber)
    } catch {
        throw new Error('Nomor rekening sudah digunakan sebelumnya.')
    }
}

async function getBankAccountByUserId(userId) {
    try {
        const bankAccounts = await bankAccountRepository.getBankAccountByUserId(userId);
        return bankAccounts;
    }
    catch (error) {
        throw errorResponder(
            errorTypes.BAD_REQUEST, 'Bad request'
        )
    }
}

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

async function getBankAccountByAccountNumber() {
    const bankAccounts = await bankAccountRepository.getByAccountNumberAndUserId(accountNumber, userId);
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
                "Bank account not found!"
            );
        }

        if (bankAccounts.balance < total) {
            throw errorResponder(
                errorTypes.BAD_REQUEST,
                "balance is not enough"
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

async function withdraw(accountNumber, userId, total) {
    try {
        const bankAccounts = await bankAccountRepository.getBankAccountNumberAndUserId(accountNumber, userId);
        if (!bankAccounts) {
            throw errorResponder(
                errorTypes.NOT_FOUND,
                "Bank account is not found!"
            );
        }

        if (bankAccounts.balance < total) {
            throw errorResponder(
                errorTypes.NOT_FOUND,
                "Ops, balance not enough"
            );
        }

        bankAccounts.balance -= total;

        let responseTransactions = await bankAccountRepository.withdraw(bankAccounts, total);
        return responseTransactions;
    } catch (error) {
        throw errorResponder(
            errorTypes.BAD_REQUEST,
            error.message
        );
    }
}

async function transfer(accountNumber, accountNumberDestination, userId, total, email) {
    try {
        const user = await getUserByEmail(email);
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

async function topUp(accountNumber, userId, amount) {
    var bankAccount = await bankAccountRepository.findByAccountNumber(accountNumber, userId);
    if (!bankAccount) {
        throw errorResponder(
            errorTypes.NOT_FOUND,
            "Bank account not found"
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
    bankAccount.accountNumber = newAccountNumber;
    return await bankAccountRepository.update(bankAccount);
}

async function deleteAccountNumber(account_number, userId) {
    let bankAccount = await bankAccountRepository.findByAccountNumber(account_number, userId);
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
    topUp,
    transfer,
    updateAccountNumber,
    deleteAccountNumber,
}

