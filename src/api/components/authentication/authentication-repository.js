const { User } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Sets user failed login time
 * @param {string} email - Email
 * @param {string} timestamp - Timestamp
 * @returns {Promise}
 */
async function setLastFailLog(email, timestamp) {
  await User.updateOne({ email: email }, { lastFailLog: timestamp });
}

/**
 * Resets user failed login attempt
 * @param {string} email - Email
 * @returns {Promise}
 */
async function resetFailedLoginAttempts(email) {
  await User.updateOne({ email: email }, { failedLoginAttempts: 0 });
}

module.exports = {
  getUserByEmail,
  setLastFailLog,
  resetFailedLoginAttempts,
};
