const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

let lockTillConstant = null;
let attempts = {};

async function login(request, response, next) {
  const { email, password } = request.body;
  const lock = 30 * 60 * 1000;

  try {
    attempts[email] = attempts[email] || 0;

    // 1. Memeriksa apakah akun terkunci
    if (lockTillConstant && lockTillConstant > Date.now()) {
      const formatLock = new Date(lockTillConstant).toISOString();
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Your account is locked. Please try again later.' + formatLock
      );
    }

    // 2. Memeriksa keberhasilan login
    let loginSuccess = await authenticationServices.checkLoginCredentials(email, password);

    if (loginSuccess) {
      attempts[email] = 0;
      await authenticationServices.resetFailedLoginAttempts(email);
      return response.status(200).json(loginSuccess);
    }

    // 3. Memeriksa percobaan gagal
    if (attempts[email] < 5) {
      attempts[email]++;
      await authenticationServices.setLastFailLog(email, new Date().toISOString());
      console.log("[" + new Date().toISOString() + "] User " + email + " gagal login. Attempt = " + attempts[email]);
      return response.status(401).json({ message: 'Invalid email or password', attemptsLeft: (5 - attempts[email]) });
    }

    // 4. Memeriksa apakah mencapai batas percobaan gagal
    lockTillConstant = Date.now() + lock;
    throw errorResponder(
      errorTypes.FORBIDDEN,
      'Too Many Login Attempts, your account will be opened on ' + new Date(lockTillConstant).toISOString(),
    );

  } catch (error) {
    return next(error);
  }
}


module.exports = {
  login,
};