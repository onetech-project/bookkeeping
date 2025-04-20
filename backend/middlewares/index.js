const limitter = require('./limtter');
const policies = require('./policies');
const errorHandler = require('./errorHandler');
const payloadValidator = require('./payloadValidator');

module.exports = {
  ...limitter,
  ...policies,
  ...errorHandler,
  ...payloadValidator
};