const express = require('express');
const onlineBankController = require('./onlinebank-controller');
const onlineBankValidator = require('./onlinebank-validator');
const celebrate = require('../../../core/celebrate-wrappers');
const onlinebankValidator = require('./onlinebank-validator');
const { verifyToken } = require('../../../utils/auth');

const route = express.Router();

module.exports = (app) => {
    app.use('/online-bank', route);

    // Creates bank account
    route.post(
        '/',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlinebankValidator.create),
        onlineBankController.create
    );

    // Get a list of bank account using user id
    route.get(
        '/',
        verifyToken, // Middleware untuk memeriksa token
        onlineBankController.getBankAccountByUserId
    );

    // Get a list of 
    route.get(
        '/detail/:id',
        verifyToken, // Middleware untuk memeriksa token
        onlineBankController.getBankAccountByAccountNumber
    );

    // ini untuk menampilkan riwayat transaction berdasarkan nomer rekening
    route.get(
        '/transactions/:id',
        verifyToken, // Middleware untuk memeriksa token
        onlineBankController.getTransactionHistory
    );

    // ini untuk mengisi saldo di bank
    route.post(
        '/deposit',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.deposit),
        onlineBankController.deposit
    );

    // Route ini fungsinya untuk menarik uang
    route.post(
        '/withdraw',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.withdraw),
        onlineBankController.withdraw
    );


    // Route ini fungsinya untuk mentransfer balance ke account lain
    route.post(
        '/transfer',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.transfer),
        onlineBankController.transfer
    );

    // Route akan mengedit angka
    route.put(
        '/edit/:oldAccountNumber',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.update),
        onlineBankController.updateAccNumber
    );


    route.delete(
        '/delete',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.delete),
        onlineBankController.deleteAccountNumber
    );

};
