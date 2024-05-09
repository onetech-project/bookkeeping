const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

db.start();

app.use(authRoutes);
app.use(transactionRoutes);

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