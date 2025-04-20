const { connection } = require('../db');

class LoanController {
  // Admin: Create a new loan
  static createLoan(req, res) {
    const { userId, principal, interestRate, term } = req.body;

    const existingLoanQuery = `SELECT * FROM loans WHERE user_id = ? AND status = 'active'`;
    connection.query(existingLoanQuery, [userId], (error, results) => {
      if (error) {
        console.error('Error checking existing loans:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'User already has an active loan' });
      }

      const query = `
          INSERT INTO loans (user_id, principal, interest_rate, term, remaining_balance, created_at, updated_at, status)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 'active')
        `;
      const values = [userId, principal, interestRate, term, principal];

      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Error creating loan:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(201).json({ message: 'Loan created successfully', loanId: results.insertId });
      });
    });
  }

  // Admin: Record a payment for a loan
  static recordPayment(req, res) {
    const { loanId } = req.params;
    const { amount } = req.body;

    // Fetch the loan details
    connection.query(`SELECT * FROM loans WHERE id = ? AND status = 'active'`, [loanId], (error, results) => {
      if (error) {
        console.error('Error fetching loan:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const loan = results[0];
      if (!loan) {
        return res.status(404).json({ error: 'Active loan not found or loan has been paid off' });
      }

      // Calculate interest and principal payment
      const interest = (loan.remaining_balance * loan.interest_rate) / 12 / 100;
      const principalPayment = amount - interest;
      const newBalance = Math.max(0, loan.remaining_balance - principalPayment);
      const status = newBalance <= 0 ? 'paid off' : 'active';

      // Update the loan's remaining balance
      connection.query(
        `UPDATE loans SET remaining_balance = ?, status = ?, updated_at = NOW() WHERE id = ?`,
        [newBalance, status, loanId],
        (updateError) => {
          if (updateError) {
            console.error('Error updating loan balance:', updateError);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Record the payment
          const paymentQuery = `
            INSERT INTO payments (loan_id, amount, interest, principal_payment, remaining_balance, date, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
          `;
          const paymentValues = [loanId, amount, interest, principalPayment, newBalance];

          connection.query(paymentQuery, paymentValues, (paymentError, paymentResults) => {
            if (paymentError) {
              console.error('Error recording payment:', paymentError);
              return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json({
              message: 'Payment recorded',
              paymentId: paymentResults.insertId,
              remainingBalance: newBalance,
            });
          });
        }
      );
    });
  }

  // Get loans for a specific user
  static getUserLoans(req, res) {
    const { userId } = req.user;

    connection.query(`SELECT * FROM loans WHERE user_id = ?`, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching user loans:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(200).json({ loans: results });
    });
  }

  // Get loans by id
  static getLoanById(req, res) {
    const { userId, role } = req.user;
    const { loanId } = req.params;

    connection.query(`SELECT * FROM loans WHERE id = ? ${role === 'user' ? 'AND user_id = ?' : ''}`, [loanId, userId], (error, results) => {
      if (error) {
        console.error('Error fetching user loans:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: 'Loan not found' });
      }

      let paymentHistory;
      connection.query(`SELECT * FROM payments WHERE loan_id = ?`, [loanId], (paymentError, paymentResults) => {
        if (paymentError) {
          console.error('Error fetching payment history:', paymentError);
          paymentHistory = paymentError.message;
        }
        paymentHistory = paymentResults;
        res.status(200).json({ ...results[0], paymentHistory });
      })
    });
  }

  // Admin: Get loans for a specific user by userId
  static getLoansByUserId(req, res) {
    const { userId } = req.params;

    connection.query(`SELECT * FROM loans WHERE user_id = ?`, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching loans by userId:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(200).json({ loans: results });
    });
  }

  // Admin: Get all loans
  static getAllLoans(req, res) {
    connection.query(`SELECT * FROM loans`, (error, results) => {
      if (error) {
        console.error('Error fetching all loans:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(200).json({ loans: results });
    });
  }
}

module.exports = LoanController;