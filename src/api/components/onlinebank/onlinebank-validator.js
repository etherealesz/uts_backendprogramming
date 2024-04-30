const Joi = require('joi');

module.exports = {
    create: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Mengubah label dari 'Email' menjadi 'Nomor Akun'
        },
    },
    top_up: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Mengubah label dari 'Email' menjadi 'Nomor Akun'
            total: Joi.number().required().label('Total'), // Mengubah label dari 'Email' menjadi 'Nomor Akun'
        },
    },
    withdraw: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Mengubah label dari 'Email' menjadi 'Nomor Akun'
            total: Joi.number().min(1).required().label('Total'), // Mengubah label dari 'Email' menjadi 'Nomor Akun'
        },
    },
    transfer: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Mengubah label dari 'Email' menjadi 'Nomor Akun',
            account_number_destination: Joi.string().required().label('Nomor Rekening Tujuan'), // Mengubah label dari 'Email' menjadi 'Nomor Akun',
            email: Joi.string().email().required().label('Email Tujuan'), // Mengubah label dari 'Email' menjadi 'Nomor Akun', , 
            total: Joi.number().min(1).required().label('Total'), // Mengubah label dari 'Email' menjadi 'Nomor Akun'
        },
    },
    update: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening Baru'), // Mengubah label dari 'Email' menjadi 'Nomor Akun',
        },
    },
    delete: {
        body: {
            account_number: Joi.string().required().label('Nomor Rekening'), // Mengubah label dari 'Email' menjadi 'Nomor Akun',
        },
    }
};
