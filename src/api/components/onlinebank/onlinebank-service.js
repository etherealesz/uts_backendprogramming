const bankAccountRepository = require('./onlinebank-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { BankAccount } = require('../../../models');

async function createBankAccount(userId, accountNumber){
  try {
  const existingBankAccount = await BankAccount.findOne({accountNumber: accountNumber});
  if(existingBankAccount){
    
  }
  } catch {

  }
}

async function getBankAccountByUserId(userId){
  try {
    const bankAccounts = await bankAccountRepository.getBankAccountByUserId(userId);
    return bankAccounts;
  }
  catch(error){
    throw errorResponder(
      errorTypes.BAD_REQUEST, 'Bad request'
    )
  }
}

async function findByAccountNumber(accountNumber, userId){
  try {
    const bankAccount = await bankAccountRepository.getByAccountNumberAndUserId(accountNumber, userId);
    if (!bankAccount) {
        throw errorResponder(
            errorTypes.NOT_FOUND,
            "Bank account not found"
        );
    }
    return bankAccount;
} catch (error) {
    throw error;
  }
}

module.exports = {
  getBankAccountByUserId,
  findByAccountNumber,
}

