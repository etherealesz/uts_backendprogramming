const { errorResponder, errorTypes } = require('../../../core/errors');
const onlineBankService = require('./onlinebank-service');

/**
 * Creates a bank account
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function create(request, response, next) {
  const userId = request.userId;
  const accountNumber = request.body.account_number;
  try {
    const success = await onlineBankService.createBankAccount(
      userId,
      accountNumber
    );
    if (success) {
      return response.json({
        code: 201,
        message: 'Successfully added new bank account number',
      });
    } else {
      throw errorResponder(
        errorTypes.BAD_REQUEST,
        'Bad request',
        'Gagal menambahkan account bank, account bank sudah digunakan'
      );
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Gets a list of bank account from user id
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getBankAccountByUserId(request, response, next) {
  const userId = request.userId;
  try {
    var bankAccount = await onlineBankService.getBankAccountByUserId(userId);
    return response.json({
      code: 200,
      message: 'Successfully get data bank account',
      data: bankAccount,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Gets the transaction history off accountId and userId
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getTransactionHistory(request, response, next) {
  const userId = request.userId;
  const accountId = request.params.id; // nomer rekening
  try {
    var bankAccount = await onlineBankService.getTransactionHistory(
      accountId,
      userId
    );
    return response.json({
      code: 200,
      message: 'Successfully get transaction history',
      data: bankAccount,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Deposits money into bank account
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deposit(request, response, next) {
  const userId = request.userId;
  const accountNumber = request.body.account_number;
  const total = request.body.total;
  try {
    var bankAccount = await onlineBankService.deposit(
      accountNumber,
      userId,
      total
    );
    if (!bankAccount) {
      throw errorResponder(
        errorTypes.NOT_FOUND,
        'Bank account not found / The account you wanted to topup for is not your account!'
      );
    }
    return response.json({
      code: 201,
      message: `Succesfully deposit money in bank account ${accountNumber}`,
      data: bankAccount,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Withdraws money from bank account
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function withdraw(request, response, next) {
  const userId = request.userId;
  const accountNumber = request.body.account_number;
  const total = request.body.total;
  try {
    let bankAccount = await onlineBankService.getBankAccountNumberAndUserId(
      accountNumber,
      userId
    );
    if (!bankAccount) {
      throw errorResponder(
        errorTypes.NOT_FOUND,
        'Bank account not found / The account you wanted to withdraw from is not your account!'
      );
    }
    if (bankAccount.balance < total) {
      throw errorResponder(errorTypes.BAD_REQUEST, 'Balance is not enough');
    }

    var transactionHistory = await onlineBankService.withdraw(
      bankAccount,
      total
    );
    if (transactionHistory) {
      return response.json({
        code: 200,
        message: 'Succesfully withdraw money',
        data: transactionHistory,
      });
    }
    throw new Error('Terjadi kesalahan saat melakukan withdraw');
  } catch (error) {
    return next(error);
  }
}

/**
 * Transfers money from a bank account to another bank account
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function transfer(request, response, next) {
  const userId = request.userId;
  const accountNumber = request.body.account_number;
  const accountNumberDestination = request.body.account_number_destination;
  const total = request.body.total;
  const email = request.body.email;
  try {
    const user = await onlineBankService.getUserByEmail(email);
    if (!user) {
      throw errorResponder(
        errorTypes.NOT_FOUND,
        'User destination is not found!'
      );
    }

    if (user._id == userId) {
      throw errorResponder(
        errorTypes.BAD_REQUEST,
        "You can't transfer to yourself."
      );
    }

    // sumber
    let bankAccount = await onlineBankService.getBankAccountNumberAndUserId(
      accountNumber,
      userId
    );
    // destination
    let bankAccountDestination =
      await onlineBankService.getBankAccountNumberAndUserId(
        accountNumberDestination,
        user._id
      );

    if (!bankAccount) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Account number not found');
    }

    if (!bankAccountDestination) {
      throw errorResponder(
        errorTypes.NOT_FOUND,
        'Account number Destination not found'
      );
    }

    if (bankAccount.balance < total) {
      throw errorResponder(errorTypes.BAD_REQUEST, 'Balance is not enough');
    }

    if (total <= 0) {
      throw errorResponder(
        errorTypes.BAD_REQUEST,
        'Nominal must be greater than 0'
      );
    }

    var transactionHistory = await onlineBankService.transfer(
      bankAccount,
      bankAccountDestination,
      total
    );
    if (transactionHistory) {
      return response.json({
        code: 200,
        message: `Succesfully transfer money to ${email}`,
        data: transactionHistory,
      });
    } else {
      throw errorResponder(
        errorTypes.SERVER,
        'Failed to transfer please try again'
      );
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Deletes a bank account
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteAccountNumber(request, response, next) {
  const userId = request.userId;
  const accountNumber = request.body.account_number;

  try {
    var isDelete = await onlineBankService.deleteAccountNumber(
      accountNumber,
      userId
    );
    if (isDelete) {
      return response.json({
        code: 202,
        message: 'Succesfully delete account number',
        data: true,
      });
    } else {
      throw errorResponder(errorTypes.NOT_FOUND, 'Bank account not found!');
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Gets the transaction history off accountId and userId
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getBankAccountByAccountNumber(request, response, next) {
  try {
    const userId = request.userId;
    const accountNumber = request.params.id;
    const bankAccount = await onlineBankService.getBankAccountByAccountNumber(
      accountNumber,
      userId
    );
    if (bankAccount) {
      return response.json({
        bankAccount,
      });
    }
    throw errorResponder(errorTypes.NOT_FOUND, 'Bank account not found!');
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
    var bankAccount = await onlineBankService.updateAccountNumber(
      accountNumberOld,
      accountNumber,
      userId
    );
    // penagnanan ketika account bank tidak
    if (bankAccount == null) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Bank account not found');
    }
    if (bankAccount == false) {
      throw errorResponder(
        errorTypes.BAD_REQUEST,
        'Nomor rekening sudah digunakan sebelumnya.'
      );
    }
    return response.json({
      code: 200,
      message: 'Succesfully update account number',
      data: bankAccount,
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
  deleteAccountNumber,
};
