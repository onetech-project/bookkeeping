const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { connection } = require('../db')

exports.login = (req, res) => {
  // Check username and password from database
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);

    if (!results[0].username) {
      return res.status(401).send('incorrect username or password');
    };

    bcrypt.compare(password, results[0].password, (err, result) => {
      if (err) throw err;

      if (result) {
        // Generate token
        jwt.sign({
          userId: results[0].id,
          name: results[0].name,
          role: results[0].role
        }, process.env.JWT_KEY, { expiresIn: '24h' }, (err, token) => {
          if (err) return res.status(500).send(err)
          return res.json({ token });
        });
      } else {
        return res.status(401).send('incorrect username or password');
      }
    });
  })
}

exports.register = (req, res) => {
  // Check if username already exists
  const { name, username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);

    if (results[0]) {
      return res.status(400).send('username already exists');
    };

    const salt = bcrypt.genSaltSync(10);

    // Hash password
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;

      // Insert user into database
      connection.query('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)', [name, username, hash, 'user'], (error, results) => {
        if (error) return res.status(500).send(`${error.code}: ${error.message}`);
        return res.status(201).send('user created');
      });
    });
  })
}