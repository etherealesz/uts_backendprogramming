const Joi = require('joi');

module.exports = {
    create: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Untuk create akan membutuhkan body account_number
        },
    },
    deposit: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Untuk deposit uang akan membutuhkan account_number
            total: Joi.number().required().label('Total'), // serta total yang berupa jumlah uang
        },
    },
    withdraw: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Untuk withdraw uang akan membutuhkan account_number
            total: Joi.number().min(1).required().label('Total'), // serta total yang berupa jumlah uang
        },
    },
    transfer: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Untuk transfer uang akan membutuhkan account_number
            account_number_destination: Joi.string().required().label('Nomor Rekening Tujuan'), // kemudian rekening yang dituju
            email: Joi.string().email().required().label('Email Tujuan'),  // email yang dituju dikarenakan satu email bisa banyak rekening
            total: Joi.number().min(1).required().label('Total'), // membutuhkan total juga.
        },
    },
    update: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening Baru'), // Untuk update disini hanya berlaku untuk account_number
        },
    },
    delete: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Untuk delete hanya akan menghapus account_number
        },
    }
};
