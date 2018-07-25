export default {
  restURL: 'http://localhost:8321/rest',
  pendingDay: 2, // normal pending day for transaction
  paymentPendingDay: 1,
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
    ccPayment: 'CC Payment',
    ccMinPayment: 'CC min Payment',
    lsPayment: 'Last Statment Payment',
    shopping: 'Shopping',
    lease: 'Lease',
    loan: 'Loan',
    utils: 'Utils',
    transfer: 'Transfer',
    income: 'Income',
    restaurant: 'Restaurant'
  },
  recurringPeriod: {
    monthly: 'monthly',
    weekly: 'weekly',
    biWeek: 'biWeek'
  },
  dateDisplayFormat: "MM/DD/YYYY",
  datepickerFormat: "YYYY-MM-DD",
  weekDays: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  }
}