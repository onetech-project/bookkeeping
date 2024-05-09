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
        jwt.sign({ username }, process.env.JWT_KEY, { expiresIn: '24h' }, (err, token) => {
          if (err) return res.status(500).send(err)
          return res.json({ token });
        });
      } else {
        return res.status(401).send('incorrect username or password');
      }
    });
  })
}