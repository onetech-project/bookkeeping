const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const start = () => {
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
}

module.exports = { connection, start };