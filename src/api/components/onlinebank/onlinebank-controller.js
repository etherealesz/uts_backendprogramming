const { decodeToken } = require('../../../core/auth');
const { errorResponder, errorTypes } = require('../../../core/errors');
const onlineBankService = require('./onlinebank-service');

async function create(request, response, next) {
    const token = request.headers.authorization;
    const userId = decodeToken(token);
    const accountNumber = request.body.account_number;

    try {
        var bankAccount = await onlineBankService.createBankAccount(userId, accountNumber);
        return response.json({
            code: 201,
            message: "Succesfully added new bank account number",
            data: bankAccount
        });
    } catch (error) {
        return next(error);
    }
}


async function getBankAccountByUserId(request, response, next) {
    const token = request.headers.authorization;
    const userId = decodeToken(token);

    try {
        var bankAccount = await onlineBankService.getBankAccountByUserId(userId);
        return response.json({
            code: 200,
            message: "Success get data bank account",
            data: bankAccount
        });
    } catch (error) {
        return next(error);
    }
}



async function getTransactionHistory(request, response, next) {
    const token = request.headers.authorization;
    const userId = decodeToken(token);
    const accountId = request.params.id; // nomer rekening
    try {
        var bankAccount = await onlineBankService.getTransactionHistory(accountId, userId);
        return response.json({
            code: 200,
            message: "success get transaction history",
            data: bankAccount
        });
    } catch (error) {
        return next(error);
    }
}


async function topUp(request, response, next) {
    const token = request.headers.authorization;
    const userId = decodeToken(token);
    const accountNumber = request.body.account_number;
    const total = request.body.total;
    try {
        var bankAccount = await onlineBankService.topUp(accountNumber, userId, total);
        return response.json({
            code: 201,
            message: "Succesfully topup new bank account number",
            data: bankAccount
        });
    } catch (error) {
        return next(error);
    }
}


async function withdraw(request, response, next) {
    const token = request.headers.authorization;
    const userId = decodeToken(token);
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
    const token = request.headers.authorization;
    const userId = decodeToken(token);
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



async function update(request, response, next) {
    const token = request.headers.authorization;
    const userId = decodeToken(token);
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


async function deleteAccountNumber(request, response, next) {
    const token = request.headers.authorization;
    const userId = decodeToken(token);
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
        const token = request.headers.authorization;
        const userId = decodeToken(token);
        const accountNumber = request.params.id; // nomer rekening
        const bankAccount = await onlineBankService.getBankAccountByAccountNumber(accountNumber, userId);
        return response.json({
            bankAccount
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    create, 
    getBankAccountByUserId, 
    getTransactionHistory, 
    topUp,
    getBankAccountByAccountNumber, 
    withdraw, 
    transfer, 
    update, 
    deleteAccountNumber
};
