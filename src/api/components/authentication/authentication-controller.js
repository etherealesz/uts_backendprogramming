const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const moment = require('moment');

let lockTill = null;
let attempts = {};

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    attempts[email] = attempts[email] || 0;

    // 1. Memeriksa apakah akun terkunci
    if (lockTill && lockTill > moment().format('YYYY-MM-DD HH:mm:ss.SSS Z')) {
      const formatLock = moment().format('YYYY-MM-DD HH:mm:ss.SSS Z');
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
      console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss.SSS Z') + "] User " + email + " berhasil login.");
      return response.status(200).json(loginSuccess);
    }

    // 3. Memeriksa percobaan gagal
    if (attempts[email] < 5) {
      attempts[email]++;
      await authenticationServices.setLastFailLog(email, moment().format('YYYY-MM-DD HH:mm:ss.SSS Z'));
      console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss.SSS Z') + "] User " + email + " gagal login. Attempt = " + attempts[email]);
      return response.status(401).json({ message: 'Invalid email or password', attemptsLeft: (5 - attempts[email]) });
    }

    attempts[email] = 0;
    console.log("[" + moment().format('YYYY-MM-DD HH:mm:ss.SSS Z') + "] User " + email + " bisa mencoba login kembali karena sudah lebih dari 30 menit sejak penanganan limit, Attempt di reset kembali ke 0");
    // 4. Memeriksa apakah mencapai batas percobaan gagal
    lockTill = moment().add(5, 'seconds').format('YYYY-MM-DD HH:mm:ss');
    throw errorResponder(
      errorTypes.FORBIDDEN,
      'Too Many Login Attempts, your account will be opened on ' + lockTill,
    );

  } catch (error) {
    return next(error);
  }
}


module.exports = {
  login,
};