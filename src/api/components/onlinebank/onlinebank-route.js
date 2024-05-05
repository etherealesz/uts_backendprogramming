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
    verifyToken, // Middleware to check token
    celebrate(onlinebankValidator.create),
    onlineBankController.create
  );

  // Get a list of bank account using user id
  route.get(
    '/',
    verifyToken, // Middleware to check token
    onlineBankController.getBankAccountByUserId
  );

  // Get a list of a detailed according to bank account number
  route.get(
    '/detail/:id',
    verifyToken, // Middleware to check token
    onlineBankController.getBankAccountByAccountNumber
  );

  // Get a list of transaction based on
  route.get(
    '/transactions/:id',
    verifyToken, // Middleware to check token
    onlineBankController.getTransactionHistory
  );

  // Deposits money into bank account
  route.post(
    '/deposit',
    verifyToken, // Middleware to check token
    celebrate(onlineBankValidator.deposit),
    onlineBankController.deposit
  );

  // Withdraws money from bank
  route.post(
    '/withdraw',
    verifyToken, // Middleware to check token
    celebrate(onlineBankValidator.withdraw),
    onlineBankController.withdraw
  );

  // Transfers money to another account
  route.post(
    '/transfer',
    verifyToken, // Middleware to check token
    celebrate(onlineBankValidator.transfer),
    onlineBankController.transfer
  );

  // Updates an account number
  route.put(
    '/edit/:oldAccountNumber',
    verifyToken, // Middleware to check token
    celebrate(onlineBankValidator.update),
    onlineBankController.updateAccNumber
  );

  // Deletes an account number that is created
  route.delete(
    '/delete',
    verifyToken, // Middleware to check token
    celebrate(onlineBankValidator.delete),
    onlineBankController.deleteAccountNumber
  );
};
