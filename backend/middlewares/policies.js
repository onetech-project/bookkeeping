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

function isAdmin(req, res, next) {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.status(403).send('You do not have permission to perform this action');
  }
  next();
}

module.exports = {
  authenticateToken,
  isAdmin,
};