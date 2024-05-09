const express = require('express');
const controller = require('../controller/transaction');
const { authenticateToken, validateTodoInput } = require('../middlewares');

const router = express.Router();

router.get('/transactions', controller.get);

router.get('/transactions/total', controller.getTotal);

router.post('/transactions', authenticateToken, validateTodoInput, controller.store);

router.put('/transactions/:id', authenticateToken, validateTodoInput, controller.update);

router.delete('/transactions/:id', authenticateToken, controller.delete);

module.exports = router;