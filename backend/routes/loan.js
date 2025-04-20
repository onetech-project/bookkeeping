const express = require('express');
const LoanController = require('../controller/loan');
const { authenticateToken, validatePaymentInput, validateLoanInput, isAdmin } = require('../middlewares');

const router = express.Router();

// User routes
router.get('/loans', authenticateToken, LoanController.getUserLoans); // Get loans for a user
router.get('/loans/:loanId', authenticateToken, LoanController.getLoanById); // Get loan by id

// Admin routes
router.post('/admin/loans', authenticateToken, isAdmin, validateLoanInput, LoanController.createLoan); // Create a loan
router.post('/admin/loans/:loanId/payments', authenticateToken, isAdmin, validatePaymentInput, LoanController.recordPayment); // Record a payment
router.get('/admin/loans', authenticateToken, isAdmin, LoanController.getAllLoans); // Get all loans
router.get('/admin/loans/:userId', authenticateToken, isAdmin, LoanController.getLoansByUserId); // Get loans by userId

module.exports = router;