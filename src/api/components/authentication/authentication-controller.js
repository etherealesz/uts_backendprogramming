const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

let lockTillConstant = null;
let lockConstantSet = false; 
let attempts = {};

async function login(request, response, next) {
  const { email, password } = request.body;
  const lock = 30 * 1000;

  try {
    attempts[email] = attempts[email] || 0;
    let loginSuccess = false;
    
    if(lockTillConstant && lockTillConstant > Date.now()){
      const formatLock = new Date(lockTillConstant).toISOString();
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Your account is locked. Please try again later.' + formatLock
      )
    }

    if (!loginSuccess && attempts[email] < 5) {
      attempts[email]++;
      console.log("[" + new Date().toISOString() + "] User " + email + " gagal login. Attempt = " + attempts[email]);
      loginSuccess = await authenticationServices.checkLoginCredentials(email, password);

      if (!loginSuccess) {
        await authenticationServices.setLastFailLog(email, new Date().toISOString());
      }
    }

    if (!loginSuccess && attempts[email] === 5 && !lockConstantSet) {
      lockTillConstant = Date.now() + lock;
      lockConstantSet = true;
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too Many Login Attempts, your account will be opened on ' + new Date(lockTillConstant).toISOString(),
      );
    }

    if(!loginSuccess){
      const attemptsLeft = 5 - attempts[email];
      return response.status(401).json({message: 'Invalid email or password', attemptsLeft: attemptsLeft})
    }

    await authenticationServices.resetFailedLoginAttempts(email);

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
