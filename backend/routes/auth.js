const express = require('express');
const controller = require('../controller/auth');
const { validateLoginInput, validateRegisterInput, loginLimit, registerLimit } = require('../middlewares');

const router = express.Router();

router.post('/auth/login', loginLimit, validateLoginInput, controller.login);
router.post('/auth/register', registerLimit, validateRegisterInput, controller.register);

module.exports = router;