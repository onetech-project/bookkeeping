const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { authenticateToken, validateTodoInput } = require('./middlewares');

const app = express();
const port = process.env.APP_PORT || 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

connection.connect();

connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`, (error, results) => {
  if (error) throw error;
  console.log(`DB ${process.env.DB_DATABASE} successfully created`);
  connection.query(`USE ${process.env.DB_DATABASE}`, (e, r) => {
    if (e) throw e;
    console.log(`DB ${process.env.DB_DATABASE} successfully used`);
    connection.query(`CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)`, (e2, r2) => {
      if (e2) throw e2;
      console.log('Table users created');
      connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD], (e3, r3) => {
        if (e3) {
          if (e3.code === 'ER_DUP_ENTRY') return console.log('Admin account already created');
          throw e3;
        }
        console.log('Admin account created');
      });
    })
    connection.query(`CREATE TABLE IF NOT EXISTS transactions (id INT AUTO_INCREMENT PRIMARY KEY, date DATE NOT NULL, category VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, amount DECIMAL(20,2) NOT NULL, description VARCHAR(255))`, (e2, r2) => {
      if (e2) throw e2;
      console.log('Table transactions created');
    })
  })
})

app.get('/transactions', (req, res) => {
  const payload = req.query;
  const size = payload.size || 10;
  const page = payload.page || 1;
  let queryString = 'SELECT * FROM transactions';
  const where = [];
  
  if (payload.type) where.push(`type='${payload.type}'`);
  if (payload.category) where.push(`category='${payload.category}'`);
  if (payload.date) {
    const date = payload.date.split('|');
    where.push(` date BETWEEN '${date[0]}' AND '${date[1]}'`);
  }

  if (where.length > 0) queryString += ` WHERE ${where.join('AND')}`;
  
  queryString += ` ORDER BY date DESC`;
  queryString += ` LIMIT ${size}`;
  queryString += ` OFFSET ${(page - 1) * size}`;
  
  connection.query(queryString, (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);
    connection.query('SELECT CEILING(COUNT(*) / ?) AS total_pages FROM transactions', [size], (e, r) => {
      if (e) res.status(500).send(`${e.code}: ${e.message}`);
      return res.json({ data: results, totalPages: Number(r[0].total_pages) });
    })
  });
});

app.get('/transactions/total', (req, res) => {
  const { category } = req.query;
  const query = `
  SELECT (coalesce(a.total_credit, 0) - coalesce(b.total_debit,0)) AS total 
  FROM (SELECT SUM(amount) AS total_credit FROM transactions WHERE type = 'credit' AND category='${category}') a
  JOIN (SELECT SUM(amount) AS total_debit FROM transactions WHERE type = 'debit' AND category='${category}') b
  `
  connection.query(query, (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);
    return res.send(results[0]);
  });
});

app.post('/transactions', authenticateToken, validateTodoInput, (req, res) => {
  const { date, category, type, amount, description } = req.body;
  connection.query('INSERT INTO transactions (date, category, type, amount, description) VALUES (?, ?, ?, ?, ?)', [date, category, type, amount, description], (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);
    connection.query('SELECT * FROM transactions WHERE id = ?', [results.insertId], (e2, r2) => {
      if (e2) return res.status(500).send(`${e2.code}: ${e2.message}`);
      return res.send(r2[0]);
    })
  });
});

app.put('/transactions/:id', authenticateToken, validateTodoInput, (req, res) => {
  const { date, category, type, amount, description } = req.body;
  const { id } = req.params;
  connection.query('UPDATE transactions SET date = ?, category = ?, type = ?, amount = ?, description = ? WHERE id = ?', [date, category, type, amount, description, id], (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);
    connection.query('SELECT * FROM transactions WHERE id = ?', [id], (e2, r2) => {
      if (e2) return res.status(500).send(`${e2.code}: ${e2.message}`);
      return res.send(r2[0]);
    })
  });
});

app.delete('/transactions/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM transactions WHERE id = ?', [id], (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);
    return res.send(results);
  });
});

app.post('/auth/login', (req, res) => {
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
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'), (err) => {
    if (err) res.status(500).send(err);
  })
})

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  setTimeout(function () {
    process.send('ready');
  }, 1000);
});

function cleanupAndExit() {
  server.close(() => {
    console.log('bookkeeping server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', cleanupAndExit);
process.on('SIGINT', cleanupAndExit);