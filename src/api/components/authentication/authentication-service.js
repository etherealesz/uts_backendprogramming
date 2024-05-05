const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const moment = require('moment');

let lockTill = null;
let attempts = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

/**
 * Handle failed login.
 * @param {string} email - Email
 * @returns {object} An object containing information about the login attempts, including the number of attempts and
 * any potential lockout status.
 */
async function handleFailedLogin(email) {
  attempts[email] = attempts[email] || 0;
  attempts[email]++;

  // If attempts is more / equal than 5 and haven't been given timer, then it will be given timer
  if (attempts[email] >= 5 && !lockTill) {
    lockTill = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  }

  // If attempts are less than 5, then it will count the time each time they fail.
  if (attempts[email] < 5) {
    await authenticationRepository.setLastFailLog(
      email,
      moment().format('YYYY-MM-DD HH:mm:ss')
    );
  }

  return attempts[email];
}

/**
 * Resets lock time
 * @param {string} email - Email
 * Resets lock time and resets attempts
 */
async function resetLockTill(email) {
  attempts[email] = 0;
  lockTill = null;
}

/**
 * Handle failed login.
 * @param {string} email - Email
 * @returns {object} An object about email
 */
async function getAttempt(email) {
  return attempts[email];
}

/**
 * Handle successfull login.
 * @param {string} email - Email
 * @returns {Promise} Object indicating the success of the login handling process.
 */
async function handleSuccessfulLogin(email) {
  attempts[email] = 0;
  await authenticationRepository.resetFailedLoginAttempts(email);
}

/**
 * Gets lock time
 * @returns {object}
 */
function getLockTill() {
  return lockTill;
}

module.exports = {
  checkLoginCredentials,
  handleFailedLogin,
  handleSuccessfulLogin,
  getLockTill,
  resetLockTill,
  getAttempt,
};
