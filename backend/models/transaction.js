class Transaction {
  constructor(id, date, category, type, amount, description, balance) {
    this.id = id;
    this.date = date;
    this.category = category;
    this.type = type;
    this.amount = amount;
    this.description = description;
    this.balance = balance;
  }
}

module.exports = Transaction;