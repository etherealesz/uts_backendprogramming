const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const moment = require('moment');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;
  try {
    const lockTill = await authenticationServices.getLockTill();

    // If there is a timer and the time now is more than the timer, it will return an error
    if (lockTill && moment(lockTill) > moment()) {
      console.log(
        `[${moment().format('YYYY-MM-DD HH:mm:ss')}] User ${email} mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.`
      );
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Too Many Login Attempts, your account will be opened on ${lockTill}`
      );
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    // If login is successfull, then it will return login success
    if (loginSuccess) {
      await authenticationServices.handleSuccessfulLogin(email);
      console.log(
        `[${moment().format('YYYY-MM-DD HH:mm:ss')}] User ${email} berhasil login.`
      );
      return response.status(200).json(loginSuccess);
    }

    const attemptsLeft = await authenticationServices.handleFailedLogin(email);

    // If attempts left is less than equal to 5, then it will return a message to users invalid password and the amount of attempt
    if (attemptsLeft <= 5) {
      console.log(
        `[${moment().format('YYYY-MM-DD HH:mm:ss')}] User ${email} gagal login. Attempt = ${attemptsLeft}${attemptsLeft >= 5 ? '. Limit reached' : ''}`
      );
      return response
        .status(401)
        .json({
          message: 'Invalid email or password',
          attemptsLeft: 5 - attemptsLeft,
        });
    }

    // Prepares the lock reset if ever login is successfull or timer has ended
    const resetLock = async () => {
      await authenticationServices.resetLockTill(email);
      console.log(
        `[${moment().format('YYYY-MM-DD HH:mm:ss')}] User ${email} bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke ${await authenticationServices.getAttempt(email)}`
      );
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Too Many Login Attempts, your account will be opened on ${lockTill}`
      );
    };

    // Throws error if attemptsLeft is greater than 5 and shows
    if (attemptsLeft > 5) {
      if (lockTill && moment(lockTill) > moment()) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `Too Many Login Attempts, your account will be opened on ${lockTill}`
        );
      } else {
        await resetLock();
      }
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
