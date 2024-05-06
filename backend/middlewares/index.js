const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.status(403).send('Token is expired or invalid');
    }
    req.user = user;
    next();
  });
}

function validateTodoInput(req, res, next) {
  const { date, type, amount, description } = req.body;
  const message = [];
  
  if (!date) message.push('date are required.');
  if (!type) message.push('type are required.');
  if (!amount) message.push('amount are required.');
  if (!description) message.push('description are required.');

  if (message.length > 0) {
    return res.status(400).json({ message });
  }

  next();
}

module.exports = {
  validateTodoInput,
  authenticateToken
};