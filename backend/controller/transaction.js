const { connection } = require('../db');

exports.get = (req, res) => {
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
}

exports.getTotal = (req, res) => {
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
}

exports.store = (req, res) => {
  const { date, category, type, amount, description } = req.body;
  connection.query('INSERT INTO transactions (date, category, type, amount, description) VALUES (?, ?, ?, ?, ?)', [date, category, type, amount, description], (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);
    connection.query('SELECT * FROM transactions WHERE id = ?', [results.insertId], (e2, r2) => {
      if (e2) return res.status(500).send(`${e2.code}: ${e2.message}`);
      return res.send(r2[0]);
    })
  });
}

exports.update = (req, res) => {
  const { date, category, type, amount, description } = req.body;
  const { id } = req.params;
  connection.query('UPDATE transactions SET date = ?, category = ?, type = ?, amount = ?, description = ? WHERE id = ?', [date, category, type, amount, description, id], (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);
    connection.query('SELECT * FROM transactions WHERE id = ?', [id], (e2, r2) => {
      if (e2) return res.status(500).send(`${e2.code}: ${e2.message}`);
      return res.send(r2[0]);
    })
  });
}

exports.delete = (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM transactions WHERE id = ?', [id], (error, results) => {
    if (error) return res.status(500).send(`${error.code}: ${error.message}`);
    return res.send(results);
  });
}