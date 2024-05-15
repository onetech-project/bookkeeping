const jwt = require('jsonwebtoken');
const path = require('path')

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

function handle404(req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'), (err) => {
    if (err) res.status(500).send(err);
  })
}

function handle500(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send("Internal Server Error")
}

module.exports = {
  validateTodoInput,
  authenticateToken,
  handle404,
  handle500
};