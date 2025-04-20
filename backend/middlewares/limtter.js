const rateLimit = require('express-rate-limit')

const registerLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later."
});

const loginLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later."
});

module.exports = {
  registerLimit,
  loginLimit
}