// import * as moment from 'moment';

// import Constant from '../utils/constant';
// import { nextDateOfDay } from '../utils';
// import { Account } from '../models/account';
// import { Transaction } from '../models/transaction';
// import { Recurring } from '../models/recurring';

// const accounts = [
//   {
//     "_id": "5b36eec6de2bbc465459caae",
//     "type": Constant.accountType.checking,
//     "last4Num": 4344,
//     "accountName": "Alliant Checking",
//     "updatedDate": "2018-06-30T03:32:26.225Z",
//     "rewardRules": [],
//     "order": 0,
//     "apr0Valid": false,
//     "balance": 2030.76,
//     "pendingTransactions": []
//   },
//   {
//     "_id": "5b36ef4ade2bbc465459cab1",
//     "type": Constant.accountType.savings,
//     "last4Num": 5168,
//     "accountName": "TD Bank",
//     "updatedDate": "2018-06-30T02:47:38.563Z",
//     "rewardRules": [],
//     "order": 0,
//     "apr0Valid": false,
//     "balance": 132,
//     "pendingTransactions": []
//   },
//   {
//     "_id": "5b36ef4ade2bbc465459cacc",
//     "type": Constant.accountType.cc,
//     "last4Num": 1234,
//     "dueDate": nextDateOfDay(15, moment()),
//     "closingDate": nextDateOfDay(20, moment()),
//     "creditLine": 7000,
//     "minPayment": 35,
//     "accountName": "Chase CFU",
//     "updatedDate": "2018-06-30T02:47:38.563Z",
//     "order": 0,
//     "apr0Valid": false,
//     "apr0Date": {
//       "startDate": moment().subtract(3, 'months'),
//       "endDate": moment().add(1, 'years')
//     },
//     "balance": 100,
//     "lastStatementBalance": 0,
//     "pendingTransactions": [],
//     "payBy": "5b36eec6de2bbc465459caae",
//   },
//   {
//     "_id": "safdafscacc",
//     "type": Constant.accountType.cc,
//     "last4Num": 4321,
//     "dueDate": nextDateOfDay(10, moment()),
//     "closingDate": nextDateOfDay(12, moment()),
//     "creditLine": 12000,
//     "minPayment": 35,
//     "accountName": "Lewis CC",
//     "updatedDate": "2018-06-30T02:47:38.563Z",
//     "order": 0,
//     "apr0Valid": true,
//     "apr0Date": {
//       "startDate": moment().subtract(3, 'months'),
//       "endDate": moment().add(1, 'years')
//     },
//     "balance": 0,
//     "lastStatementBalance": 0,
//     "pendingTransactions": [],
//     "payBy": "5b36eec6de2bbc465459caae",
//   }
// ];

// const transactions = [
//   {
//     "_id": "5b36fd5dde2bbc465459cad9",
//     "isRecurring": false,
//     "payBy": "5b36eec6de2bbc465459caae",
//     "payTo": "5b36ef4ade2bbc465459cacc",
//     "amount": 10,
//     "date": nextDateOfDay(20, moment()),
//     "description": "Chase CFU Payment",
//     "category": "CCPayment",
//     "type": "Debit"
//   },
//   {
//     "_id": "5b36fd5dde2bbc465459cad9",
//     "isRecurring": false,
//     "payBy": "5b36eec6de2bbc465459caae",
//     "payTo": null,
//     "amount": 20,
//     "date": nextDateOfDay(25, moment()),
//     "description": "One time Shopping",
//     "category": "Shopping",
//     "type": "Debit"
//   }
// ];

// const recurrings = [
//   {
//     "_id": "5b36efeede2bbc465459bbvc",
//     "payBy": "5b36eec6de2bbc465459caae",
//     "payTo": "5b36ef4ade2bbc465459cab1",
//     "recurringPeriod": "monthly",
//     "recurringDay": "25",
//     "description": "Bank Transfer",
//     "category": "Transfer",
//     "type": "Debit",
//     "startDate": "1018-03-31T05:00:00.000Z",
//     "endDate": "3019-03-31T05:00:00.000Z",
//     "amount": 690
//   },
//   {
//     "_id": "5b36efeede2bbc465459cab4",
//     "payBy": "5b36ef4ade2bbc465459cab1",
//     "payTo": null,
//     "recurringPeriod": "monthly",
//     "recurringDay": "1",
//     "description": "Housing Rent",
//     "category": "Rent",
//     "type": "Debit",
//     "startDate": "1018-03-31T05:00:00.000Z",
//     "endDate": "3019-03-31T05:00:00.000Z",
//     "amount": 690
//   }
// ]

// export const getRecurrings = (): Recurring[] => {
//   let res: Recurring[] = [];
//   for(let recurring of recurrings) {
//     res.push(new Recurring(recurring));
//   }
//   return res;
// }

// export const getTransactions = (): Transaction[] => {
//   let res: Transaction[] = [];
//   for(let transaction of transactions) {
//     res.push(new Transaction(transaction));
//   }
//   return res;
// }

// export const getAccounts = (): Map<string, Account> => {
//   let res: Map<string, Account> = new Map();
//   for(let account of accounts) {
//     res.set(account._id, new Account(account));
//   }
//   return res;
// }