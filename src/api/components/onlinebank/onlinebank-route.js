const express = require('express');
const onlineBankController = require('./onlinebank-controller');
const onlineBankValidator = require('./onlinebank-validator');
const celebrate = require('../../../core/celebrate-wrappers');
const onlinebankValidator = require('./onlinebank-validator');
const { verifyToken } = require('../../../utils/auth');

const route = express.Router();

module.exports = (app) => {
    app.use('/online-bank', route);

    // untuk mendaftarkan nomer rekening user 
    route.post(
        '/',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlinebankValidator.create),
        onlineBankController.create
    );

    // ini untuk mendapatkan list dari nomer rekening user
    route.get(
        '/',
        verifyToken, // Middleware untuk memeriksa token
        onlineBankController.getBankAccountByUserId
    );

    // ini untuk mendapatkan data nomer rekening berdasarkan nomer rekening
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
    // ini untuk mengisi saldo dari bank
    route.post(
        '/top-up',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.top_up),
        onlineBankController.topUp
    );

    // menarik duit
    route.post(
        '/withdraw',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.withdraw),
        onlineBankController.withdraw
    );


    // transfer
    route.post(
        '/transfer',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.transfer),
        onlineBankController.transfer
    );

    route.put(
        '/edit/:oldAccountNumber',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.update),
        onlineBankController.update
    );


    route.delete(
        '/delete',
        verifyToken, // Middleware untuk memeriksa token
        celebrate(onlineBankValidator.delete),
        onlineBankController.deleteAccountNumber
    );

};
