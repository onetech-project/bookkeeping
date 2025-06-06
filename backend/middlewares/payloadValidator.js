function validateTodoInput(req, res, next) {
  const { date, type, amount, description, category } = req.body;
  const message = [];

  if (!date) message.push('date are required.');
  if (!type) message.push('type are required.');
  if (!amount) message.push('amount are required.');
  if (!description) message.push('description are required.');
  if (!category) message.push('category are required.');

  if (message.length > 0) {
    return res.status(400).json({ message });
  }

  next();
}

function validateLoanInput(req, res, next) {
  const { userId, principal, interestRate, term } = req.body;
  const message = [];

  if (!userId) message.push('userId are required.');
  if (!principal) message.push('principal are required.');
  if (!interestRate) message.push('interestRate are required.');
  if (!term) message.push('term are required.');
  if (typeof principal !== 'number') message.push('principal must be a number.');
  if (typeof interestRate !== 'number') message.push('interestRate must be a number.');
  if (typeof term !== 'number') message.push('term must be a number.');
  if (principal <= 0) message.push('principal must be greater than 0.');
  if (interestRate <= 0) message.push('interestRate must be greater than 0.');
  if (term <= 0) message.push('term must be greater than 0.');

  if (message.length > 0) {
    return res.status(400).json({ message });
  }

  next();
}

function validatePaymentInput(req, res, next) {
  const { loanId } = req.params;
  const { amount, userId } = req.body;
  const message = [];

  if (!userId) message.push('userId are required.');
  if (!loanId) message.push('loanId are required.');
  if (!amount) message.push('amount are required.');
  if (typeof amount !== 'number') message.push('amount must be a number.');
  if (amount <= 0) message.push('amount must be greater than 0.');

  if (message.length > 0) {
    return res.status(400).json({ message });
  }

  next();
}

function validateRegisterInput(req, res, next) {
  const { name, username, password, retypePassword } = req.body;
  const message = [];

  if (!name) message.push('name are required.');
  if (!username) message.push('username are required.');
  if (!password) message.push('password are required.');
  if (username.length < 3) message.push('username must be at least 3 characters long.');
  if (password.length < 6) message.push('password must be at least 6 characters long.');
  if (password !== retypePassword) message.push('password and retypePassword must be the same.');

  if (message.length > 0) {
    return res.status(400).json({ message });
  }

  next();
}

function validateLoginInput(req, res, next) {
  const { username, password } = req.body;
  const message = [];

  if (!username) message.push('username are required.');
  if (!password) message.push('password are required.');

  if (message.length > 0) {
    return res.status(400).json({ message });
  }

  next();
}

module.exports = {
  validateTodoInput,
  validateLoanInput,
  validatePaymentInput,
  validateRegisterInput,
  validateLoginInput
};