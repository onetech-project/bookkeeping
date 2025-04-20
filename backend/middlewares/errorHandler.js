const path = require('path')

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
  handle404,
  handle500
}