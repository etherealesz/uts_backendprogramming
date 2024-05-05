const { errorResponder, errorTypes } = require('../../../core/errors');
const onlineBankService = require('./onlinebank-service');

// Function ini adalah untuk create bank account baru
async function create(request, response, next) {
    const userId = request.userId;
    const accountNumber = request.body.account_number;

    try {
        const success = await onlineBankService.createBankAccount(userId, accountNumber);
        if (success) {
            return response.json({
                code: 201,
                message: "Successfully added new bank account number"
            });
        } 
    } catch (error) {
        return next(error);
    }
}


async function getBankAccountByUserId(request, response, next) {
    const userId = request.userId;

    try {
        var bankAccount = await onlineBankService.getBankAccountByUserId(userId);
        return response.json({
            code: 200,
            message: "Successfully get data bank account",
            data: bankAccount
        });
    } catch (error) {
        return next(error);
    }
}



async function getTransactionHistory(request, response, next) {
    const userId = request.userId
    const accountId = request.params.id; // nomer rekening
    try {
        var bankAccount = await onlineBankService.getTransactionHistory(accountId, userId);
        return response.json({
            code: 200,
            message: "Successfully get transaction history",
            data: bankAccount
        });
    } catch (error) {
        return next(error);
    }
}


async function deposit(request, response, next) {
    const userId = request.userId;
    const accountNumber = request.body.account_number;
    const total = request.body.total;
    try {
        var bankAccount = await onlineBankService.deposit(accountNumber, userId, total);
        return response.json({
            code: 201,
            message: `Succesfully top-up in bank account ${accountNumber}`,
            data: bankAccount
        });
    } catch (error) {
        return next(error);
    }
}


async function withdraw(request, response, next) {
    const userId = request.userId
    const accountNumber = request.body.account_number;
    const total = request.body.total;
    try {
        var transactionHistory = await onlineBankService.withdraw(accountNumber, userId, total);
        return response.json({
            code: 200,
            message: "Succesfully withdraw money",
            data: transactionHistory
        });
    } catch (error) {
        return next(error);
    }
}


async function transfer(request, response, next) {
    const userId = request.userId
    const accountNumber = request.body.account_number;
    const accountNumberDestination = request.body.account_number_destination;
    const total = request.body.total;
    const email = request.body.email;

    try {
        var transactionHistory = await onlineBankService.transfer(accountNumber, accountNumberDestination, userId, total, email);
        return response.json({
            code: 200,
            message: `Succesfully transfer money to ${email}`,
            data: transactionHistory
        });
    } catch (error) {
        return next(error);
    }
}

async function deleteAccountNumber(request, response, next) {
    const userId = request.userId;
    const accountNumber = request.body.account_number;

    try {
        await onlineBankService.deleteAccountNumber(accountNumber, userId);
        return response.json({
            code: 202,
            message: `Succesfully delete account number`,
            data: true
        });
    } catch (error) {
        return next(error);
    }
}


async function getBankAccountByAccountNumber(request, response, next) {
    try {
        const userId = request.userId;
        const accountNumber = request.params.id; // nomer rekening
        const bankAccount = await onlineBankService.getBankAccountByAccountNumber(accountNumber, userId);
        return response.json({
            bankAccount
        });
    } catch (error) {
        return next(error);
    }
}

/**
 * Handle change user's bank account number request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
  async function updateAccNumber(request, response, next) {
    const userId = request.userId;
    const accountNumber = request.body.account_number;
    const accountNumberOld = request.params.oldAccountNumber;

    try {
        var bankAccount = await onlineBankService.updateAccountNumber(accountNumberOld, accountNumber, userId);
        return response.json({
            code: 200,
            message: `Succesfully update account number`,
            data: bankAccount
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    create,
    getBankAccountByUserId,
    getTransactionHistory,
    deposit,
    getBankAccountByAccountNumber,
    withdraw,
    transfer,
    updateAccNumber,
    deleteAccountNumber
};
