const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const start = () => {
  const { ADMIN_USERNAME, ADMIN_PASSWORD, DB_DATABASE } = process.env;
  connection.connect();

  connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_DATABASE}`, (error, results) => {
    if (error) throw error;
    console.log(`DB ${DB_DATABASE} successfully created`);
    connection.query(`USE ${DB_DATABASE}`, (e, r) => {
      if (e) throw e;
      console.log(`DB ${DB_DATABASE} successfully used`);
      connection.query(`CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL
      )`, (e2, r2) => {
        if (e2) throw e2;
        console.log('Table users created');
        connection.query('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)', [ADMIN_USERNAME, ADMIN_USERNAME, ADMIN_PASSWORD, 'admin'], (e3, r3) => {
          if (e3) {
            if (e3.code === 'ER_DUP_ENTRY') return console.log('Admin account already created');
            if (e3.code === 'ER_BAD_FIELD_ERROR') {
              connection.query(`ALTER TABLE users
                ADD COLUMN role ENUM(\'admin\', \'user\') NOT NULL,
                ADD COLUMN name VARCHAR(255) NOT NULL
                `, (e4, r4) => {
                if (e4) throw e4;
                console.log('Table users updated');
                connection.query('INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)', [ADMIN_USERNAME, ADMIN_USERNAME, ADMIN_PASSWORD, 'admin'], (e5, r5) => {
                  if (e5) {
                    if (e5.code === 'ER_DUP_ENTRY') return console.log('Admin account already created');
                    throw e5;
                  }
                  console.log('Admin account created');
                });
              })
              return console.log('Admin account already created');
            }
            throw e3;
          }
          console.log('Admin account created');
        });
      })
      connection.query(`CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL, category VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        amount DECIMAL(20,2) NOT NULL,
        description VARCHAR(255)
      )`, (e2, r2) => {
        if (e2) throw e2;
        console.log('Table transactions created');
      })
      connection.query(`CREATE TABLE IF NOT EXISTS loans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        principal DECIMAL(20, 2) NOT NULL,
        interest_rate DECIMAL(5, 2) NOT NULL,
        term INT NOT NULL,
        remaining_balance DECIMAL(20, 2) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        status ENUM('active', 'paid off') NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`, (e2, r2) => {
        if (e2) throw e2;
        console.log('Table loans created');
        connection.query(`CREATE TABLE IF NOT EXISTS payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          loan_id INT NOT NULL,
          amount DECIMAL(20, 2) NOT NULL,
          interest DECIMAL(20, 2) NOT NULL,
          principal_payment DECIMAL(20, 2) NOT NULL,
          remaining_balance DECIMAL(20, 2) NOT NULL,
          date DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          FOREIGN KEY (loan_id) REFERENCES loans(id)
        )`, (e3, r3) => {
          if (e3) throw e3;
          console.log('Table payments created');
        })
      })
    })
  })
}

module.exports = { connection, start };