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
    // If there is a login attempt limit and still within the lockout period
    let lockTill = await authenticationServices.getLockTill();
    if (lockTill && moment(lockTill) > moment()) {
      console.log(
        '[' +
          moment().format('YYYY-MM-DD HH:mm:ss') +
          '] User ' +
          email +
          ' mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.'
      );
      // Return response with status 403 and error message related to attempt limit
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too Many Login Attempts, your account will be opened ons ' + lockTill
      );
    } else {
      let loginSuccess = await authenticationServices.checkLoginCredentials(
        email,
        password
      );
      // If login is successful
      if (loginSuccess) {
        // Handle actions after successful login using functions on service
        await authenticationServices.handleSuccessfulLogin(email);
        console.log(
          '[' +
            moment().format('YYYY-MM-DD HH:mm:ss') +
            '] User ' +
            email +
            ' berhasil login.'
        );
        return response.status(200).json(loginSuccess);
      }
      // If login fails
      else {
        // Calculate remaining login attempts
        const attemptsLeft =
          await authenticationServices.handleFailedLogin(email);

        // If remaining login attempts are less than or equal to 5
        if (attemptsLeft <= 5) {
          // If attempt limit is reached
          if (attemptsLeft >= 5) {
            console.log(
              '[' +
                moment().format('YYYY-MM-DD HH:mm:ss') +
                '] User ' +
                email +
                ' gagal login. Attempt = ' +
                attemptsLeft +
                '. Limit reached'
            );
          } else {
            console.log(
              '[' +
                moment().format('YYYY-MM-DD HH:mm:ss') +
                '] User ' +
                email +
                ' gagal login. Attempt = ' +
                attemptsLeft
            );
          }
          return response
            .status(401)
            .json({
              message: 'Invalid email or password',
              attemptsLeft: 5 - attemptsLeft,
            });
        } else if (attemptsLeft > 5) {
          const lockTill = authenticationServices.getLockTill();
          if (lockTill && moment(lockTill) > moment()) {
            throw errorResponder(
              errorTypes.FORBIDDEN,
              'Too Many Login Attempts, your account will be opened ons ' +
                lockTill
            );
          } else {
            // Reset lockout time for the account
            authenticationServices.resetLockTill(email);
            console.log(
              '[' +
                moment().format('YYYY-MM-DD HH:mm:ss') +
                '] User ' +
                email +
                ' bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke ' +
                (await authenticationServices.getAttempt(email))
            );
            // Throw error that account is still locked
            throw errorResponder(
              errorTypes.FORBIDDEN,
              'Too Many Login Attempts, your account will be opened on ' +
                lockTill
            );
          }
        }
      }
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
