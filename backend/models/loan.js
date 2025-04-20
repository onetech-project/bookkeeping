class Loan {
  constructor(userId, principal, interestRate, term, remainingBalance = null, createdAt = null, id = null, updatedAt = null, status = 'active') {
    this.id = id; // Loan ID (optional, for existing loans)
    this.userId = userId; // User associated with the loan
    this.principal = principal; // Loan amount
    this.interestRate = interestRate; // Annual interest rate (e.g., 5%)
    this.term = term; // Loan term in months
    this.remainingBalance = remainingBalance || principal; // Remaining balance
    this.createdAt = createdAt || new Date(); // Loan creation date
    this.updatedAt = updatedAt || new Date(); // Loan updated date
    this.status = status; // Loan status (e.g., active, paid off)
  }
}

module.exports = Loan;