const express = require('express');
const controller = require('../controller/transaction');
const { authenticateToken, validateTodoInput, isAdmin } = require('../middlewares');

const router = express.Router();

router.get('/transactions', controller.get);

router.get('/transactions/total', controller.getTotal);

router.post('/transactions', authenticateToken, isAdmin, validateTodoInput, controller.store);

router.put('/transactions/:id', authenticateToken, isAdmin, validateTodoInput, controller.update);

router.delete('/transactions/:id', authenticateToken, isAdmin, controller.delete);

module.exports = router;