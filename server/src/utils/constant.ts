export default {
  PendingDay: 2, // normal pending day for transaction
  PaymentPendingDay: 1,
  transactionType: {
    debit: 'Debit',
    credit: 'Credit'
  },
  accountType: {
    gc: 'GiftCard',
    cc: 'CreditCard',
    savings: 'Savings',
    checking: 'Checking',
  },
  paymentCategory: {
    ccPayment: 'ccPayment',
    ccMinPayment: 'Min Payment',
    lsPayment: 'Last Statment Payment'
  },
  recurringPeriod: {
    monthly: 'monthly',
    weekly: 'weekly',
    biWeek: 'biWeek'
  }
}