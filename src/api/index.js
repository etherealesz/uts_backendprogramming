const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const onlinebankRoute = require('./components/onlinebank/onlinebank-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  onlinebankRoute(app);

  return app;
};
