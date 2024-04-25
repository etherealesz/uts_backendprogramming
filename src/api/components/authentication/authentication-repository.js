const { User } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function setLastFailLog(email, timestamp) {
  // Misalnya, menyimpan data log percobaan login terakhir dalam model user
  await User.updateOne({ email: email }, { lastFailLog: timestamp });
}

async function resetFailedLoginAttempts(email) {
  // Misalnya, mereset jumlah percobaan login yang gagal ke 0 dalam model user
  await User.updateOne({ email: email }, { failedLoginAttempts: 0 });
}


module.exports = {
  getUserByEmail,
  setLastFailLog,
  resetFailedLoginAttempts,
};
