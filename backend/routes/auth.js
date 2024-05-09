const express = require('express');
const controller = require('../controller/auth');

const router = express.Router();

router.post('/auth/login', controller.login);

module.exports = router;