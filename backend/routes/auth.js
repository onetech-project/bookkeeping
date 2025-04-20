const express = require('express');
const controller = require('../controller/auth');
const { validateLoginInput, validateRegisterInput } = require('../middlewares');

const router = express.Router();

router.post('/auth/login', validateLoginInput, controller.login);
router.post('/auth/register', validateRegisterInput, controller.register);

module.exports = router;