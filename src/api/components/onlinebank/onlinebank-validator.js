const Joi = require('joi');

module.exports = {
  create: {
    body: {
      account_number: Joi.string().required().label('Nomor Rekening'), // To create, account_number is required
    },
  },
  deposit: {
    body: {
      account_number: Joi.string().required().label('Nomor Rekening'), // To deposit, account_number is required
      total: Joi.number().required().label('Total'), // also the total of balance / money
    },
  },
  withdraw: {
    body: {
      account_number: Joi.string().required().label('Nomor Rekening'), // To withdraw, account_number is required
      total: Joi.number().min(1).required().label('Total'), // also the total of balance / money
    },
  },
  transfer: {
    body: {
      account_number: Joi.string().required().label('Nomor Rekening'), // To transfer, account_number is required
      account_number_destination: Joi.string()
        .required()
        .label('Nomor Rekening Tujuan'), // then the account_number_destination
      email: Joi.string().email().required().label('Email Tujuan'), // email that has the account number
      total: Joi.number().min(1).required().label('Total'), // total of balance / money
    },
  },
  update: {
    body: {
      account_number: Joi.string().required().label('Nomor Rekening Baru'), // To update account number, account_number is required
    },
  },
  delete: {
    body: {
      account_number: Joi.string().required().label('Nomor Rekening'), // To delete account, account_number is required
    },
  },
};
