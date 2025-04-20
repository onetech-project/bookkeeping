const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const loanRoutes = require('./routes/loan');
const { handle404, handle500 } = require('./middlewares');
const helmet = require('helmet');

const app = express();
const port = process.env.APP_PORT || 3000;

db.start();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(authRoutes);
app.use(transactionRoutes);
app.use(loanRoutes);
app.use(handle404);
app.use(handle500);


const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // setTimeout(function () {
  //   process.send('ready');
  // }, 1000);
});

function cleanupAndExit() {
  server.close(() => {
    console.log('bookkeeping server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', cleanupAndExit);
process.on('SIGINT', cleanupAndExit);