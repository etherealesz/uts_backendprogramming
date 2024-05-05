const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const moment = require('moment');

async function login(request, response, next) {
  const { email, password } = request.body;
  try {
    let lockTill = await authenticationServices.getLockTill();
    if (lockTill && moment(lockTill) > moment()) {
      console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss') + "] User " + email + " mencoba login, namun mendapat error 403 karena telah melebihi limit attempt.");
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too Many Login Attempts, your account will be opened ons ' + lockTill,
      )
    } else {
      let loginSuccess = await authenticationServices.checkLoginCredentials(email, password);
      if (loginSuccess) {
        await authenticationServices.handleSuccessfulLogin(email);
        console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss') + "] User " + email + " berhasil login.");
        return response.status(200).json(loginSuccess);
      } else {
        const attemptsLeft = await authenticationServices.handleFailedLogin(email);

      if (attemptsLeft <= 5) {
        if (attemptsLeft >= 5) {
          console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss.SSS Z') + "] User " + email + " gagal login. Attempt = " + attemptsLeft + ". Limit reached");
        } else {
          console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss.SSS Z') + "] User " + email + " gagal login. Attempt = " + attemptsLeft);
        }
        return response.status(401).json({ message: 'Invalid email or password', attemptsLeft: (5 - attemptsLeft) });
      } else if (attemptsLeft > 5) {
        const lockTill = authenticationServices.getLockTill();
        if (lockTill && moment(lockTill) > moment()) {
          throw errorResponder(
            errorTypes.FORBIDDEN,
            'Too Many Login Attempts, your account will be opened ons ' + lockTill,
          )
        } else {
          authenticationServices.resetLockTill(email);
          console.log("User can attempt login again because it has been more than 30 minutes since the limit was applied. Attempts reset to " + await authenticationServices.getAttempt(email));
          throw errorResponder(
            errorTypes.FORBIDDEN,
            'Too Many Login Attempts, your account will be opened on ' + lockTill,
          )
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