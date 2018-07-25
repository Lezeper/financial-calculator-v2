export default {
  pendingDay: {
    cashEquiv: 0,
    normal: 2, // normal pending day for transaction
    ccPayment: 1
  },
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