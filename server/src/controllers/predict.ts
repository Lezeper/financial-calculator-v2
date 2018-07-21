import * as _ from 'lodash';
import * as moment from 'moment';

import * as Utils from '../utils';
import Constant from '../utils/constant';
import { Account, AccountModel } from '../models/account';
import { Recurring, RecurringModel } from '../models/recurring';
import { Transaction, TransactionModel } from '../models/transaction';

type AccountAddi = {
  lowestBalanceAccounts: Map<string, { date, balance, accountName }>,
  financialTrouble: boolean,
  currentDay: moment.Moment,
  currentTransactions: Transaction[],
};

type PreditReport = {
  statements: Statement[],
  lowestBalanceAccounts: [string, { date: any; balance: number; accountName: string }][],
  financialTrouble: boolean,
}

type Statement = {
  date: moment.Moment,
  transactions: Transaction[],
  accounts: Account[]
}

const weekOfMonth = (m) => {
  return m.week() - moment(m).startOf('month').week() + 1;
}

const deleteChanged = (map: Map<string, Account>): void => {
  for (let obj of map) {
    obj[1].changed = 0;
  }
}

const getPendingDay = (category: string): number => {
  if (category === Constant.paymentCategory.ccPayment) {
    return 1;
  }
  return Constant.PaymentPendingDay;
}

const getOppositeTranType = (transaction: Transaction) => {
  if (transaction.type === Constant.transactionType.credit)
    return Constant.transactionType.debit;
  return Constant.transactionType.credit;
}

const isAccountsTrouble = (accounts: Map<string, Account>, additional: AccountAddi): void => {
  if(additional.financialTrouble === true) return;

  accounts.forEach((v, k) => {
    if (v.type === Constant.accountType.cc && v.balance > v.creditLine) {
      additional.financialTrouble = true; return;
    } else if (v.type === Constant.accountType.gc && _.isNil(v.payBy)) {
      additional.financialTrouble = true; return;
    } else if (v.balance < 0) {
      additional.financialTrouble = true; return;
    }
  });
}

// we only care about Cash account
const setlowestBalanceAccounts = (account: Account, additional: AccountAddi): void => {
  if (additional.lowestBalanceAccounts.has(account._id + '')) {
    if (additional.lowestBalanceAccounts.get(account._id + '').balance * 1 > account.balance) {
      additional.lowestBalanceAccounts.set(account._id + '',
      Utils.copy({
          date: additional.currentDay, balance: account.balance, accountName: account.accountName
        })
      );
    }
  } else {
    additional.lowestBalanceAccounts.set(account._id + '',
    Utils.copy({
        date: additional.currentDay, balance: account.balance, accountName: account.accountName
      })
    );
  }
}

const calByAccTypeAndTranType = (account: Account, transactionType: string, updateVal: number,
  amount: number, additional: AccountAddi): number => {
  // transaction is debit behavior
  // for credit card need to add number
  // for others account need to subtract number
  if (transactionType === Constant.transactionType.debit) {
    if (account.type === Constant.accountType.cc) {
      updateVal += amount;
    } else {
      updateVal -= amount;
      setlowestBalanceAccounts(account, additional);
    }
  } else {
    if (account.type === Constant.accountType.cc) {
      updateVal -= amount;
    } else {
      updateVal += amount;
    }
  }
  return updateVal; // it could be negative
}

// convert pending transaction to balance if satisfied, it should check financial trouble
const convertPendingToBalance = (accounts: Map<string, Account>, additional: AccountAddi): void => {
  for (let map of accounts) {
    let account = map[1];
    if (_.isNil(account.pendingTransactions)) account.pendingTransactions = [];

    let remainPendingTransactions: Transaction[] = [];

    // go through each pending transactions
    let removedPending = [];
    for (let pendingTransaction of account.pendingTransactions) {
      // if time is matched
      if (additional.currentDay.diff(Utils.dateFormat(pendingTransaction.date), 'days') >= pendingTransaction.pendingDay) {
        account.balance = calByAccTypeAndTranType(account, pendingTransaction.type, account.balance, pendingTransaction.amount, additional);
        account.changed = calByAccTypeAndTranType(account, pendingTransaction.type, account.changed || 0, pendingTransaction.amount, additional);

        // for payToAccount
        let payToAccount = accounts.get(pendingTransaction.payTo);
        if (payToAccount) {
          payToAccount.balance = calByAccTypeAndTranType(
            payToAccount,
            getOppositeTranType(pendingTransaction),
            payToAccount.balance,
            pendingTransaction.amount, additional
          );
          payToAccount.changed = calByAccTypeAndTranType(
            payToAccount,
            getOppositeTranType(pendingTransaction),
            payToAccount.changed || 0,
            pendingTransaction.amount,
            additional
          );
        }
      } else {
        remainPendingTransactions.push(pendingTransaction);
      }
    }
    account.pendingTransactions = remainPendingTransactions;
  }
}

const applyTransaction = (account: Account, transaction: Transaction, additional: AccountAddi): void => {
  if (transaction.pendingDay > 0) {
    // if this transaction is pending
    account.pendingTransactions.push(Utils.copy(new Transaction({
      date: additional.currentDay,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      type: transaction.type,
      payBy: transaction.payBy,
      payTo: transaction.payTo,
      pendingDay: transaction.pendingDay
    })));
  } else {
    updateBalance(account, transaction, additional);
  }
}

const checkForGC = (accounts: Map<string, Account>, account: Account, transaction: Transaction, additional: AccountAddi) => {
  // if gift card run out of balance, then use backup account to pay
  if (account.type === Constant.accountType.gc && account.balance < 0) {
    let payExtra = Utils.copy(account.balance * -1);
    // transaction.amount = transaction.amount - payExtra;
    account.balance = 0;
    let newExtraTransaction: Transaction = new Transaction({
      date: additional.currentDay,
      amount: payExtra,
      category: transaction.category,
      description: transaction.description,
      type: transaction.type,
      payBy: account.payBy,
      pendingDay: getPendingDay(transaction.category)
    });
    let backupAccount = accounts.get(account.payBy);
    if (_.isNil(backupAccount)) console.error('no backupAccount for GC');
    else applyTransaction(backupAccount, newExtraTransaction, additional);
  }
}

const updateBalance = (account: Account, transaction: Transaction, additional: AccountAddi): void => {
  if (!_.isNil(account)) {
    account.balance = calByAccTypeAndTranType(account, transaction.type, account.balance, transaction.amount, additional);
    // TODO: should we remove this? it must be credit to a credit card.
    if (account.type === Constant.accountType.cc) {
      account.avaliableBalance = account.avaliableBalance - transaction.amount;
      // calculate pending
      for (let pt of account.pendingTransactions) {
        if (pt.type === Constant.transactionType.debit) {
          account.avaliableBalance = account.avaliableBalance - pt.amount;
        } else if (pt.type === Constant.transactionType.credit) {
          account.avaliableBalance = account.avaliableBalance + pt.amount;
        }
      }
    }
    account.changed = calByAccTypeAndTranType(account, transaction.type, account.changed || 0, transaction.amount, additional);
  } else {
    console.error('account not found for updateBalance');
  }
}

const isPayRecurringDate = (currentDate: moment.Moment, recurringPayment: Recurring): boolean => {
  let tempRecurringtDate = Utils.copy(recurringPayment.recurringDay);

  if (recurringPayment.recurringPeriod === Constant.recurringPeriod.monthly) {
    if (Number(recurringPayment.recurringDay) === Number(currentDate.format('D'))
      && Utils.isTargetDateBetween(recurringPayment.startDate, recurringPayment.endDate, currentDate)) {
      return true;
    }
  }
  if (recurringPayment.recurringPeriod === Constant.recurringPeriod.weekly) {
    if (recurringPayment.recurringDay === currentDate.format('dddd')
      && Utils.isTargetDateBetween(recurringPayment.startDate, recurringPayment.endDate, currentDate)) {
      return true;
    }
  }
  if (recurringPayment.recurringPeriod === Constant.recurringPeriod.biWeek) {
    if (recurringPayment.recurringDay === currentDate.format('dddd') && (weekOfMonth(currentDate) % 2 === 1)
      && Utils.isTargetDateBetween(recurringPayment.startDate, recurringPayment.endDate, currentDate)) {
      return true;
    }
  }
  return false;
}

const getAccountsToApplyTran = (accounts: Map<string, Account>, payByAccStr: string, payToAccStr: string,
  transaction: Transaction, additional: AccountAddi): void => {
  let payByAccount = accounts.get(transaction.payBy);
  let payToAccount = accounts.get(transaction.payTo);
  if (_.isNil(payByAccount)) {
    console.error('payByAccount not found for getAccountsToApplyTran', transaction.payBy);
  } else {
    // apply transaction to payBy account
    applyTransaction(payByAccount, transaction, additional);
    // if have payTo account, then apply the opposite transaction type
    if (payToAccount) {
      applyTransaction(payToAccount, new Transaction({ ...Utils.spreadModel(transaction), type: getOppositeTranType(transaction) }), additional);
    }
    // check for GC
    // checkForGC(accounts, payByAccount, transaction, additional);
    additional.currentTransactions.push(new Transaction({ ...Utils.spreadModel(transaction), date: additional.currentDay }));
  }
}

const deductOTPayments = (accounts: Map<string, Account>, transactions: Transaction[], additional: AccountAddi): void => {
  for (let transaction of transactions) {
    if (Utils.isSameDay(transaction.date, additional.currentDay)) {
      getAccountsToApplyTran(accounts, transaction.payBy, transaction.payTo, transaction, additional);
    }
  }
}

const deductRecurringPayments = (accounts: Map<string, Account>, recurrings: Recurring[], additional: AccountAddi): void => {
  for (let recurring of recurrings) {
    if (isPayRecurringDate(additional.currentDay, recurring)) {
      getAccountsToApplyTran(accounts, recurring.payBy, recurring.payTo, new Transaction(recurring), additional);
    }
  }
}

const makeDueDatePayment = (cc: Account, accounts: Map<string, Account>, additional: AccountAddi): void => {
  let needPay = 0, description;
  // if user want to use apr 0
  if (cc.apr0Date && Utils.isTargetDateBetween(cc.apr0Date.startDate, cc.apr0Date.endDate, cc.dueDate)) {
    needPay = cc.minPayment;
    if (needPay > cc.balance)
      needPay = cc.balance;
    cc.lastStatementBalance = (cc.balance - needPay);
    description = Constant.paymentCategory.ccMinPayment;
  } else {
    needPay = cc.lastStatementBalance;
    cc.lastStatementBalance = 0;
    description = Constant.paymentCategory.lsPayment;
  }

  if (needPay === 0) return;

  cc.avaliableBalance = cc.avaliableBalance + needPay;
  cc.changed = calByAccTypeAndTranType(cc, Constant.transactionType.credit, cc.changed || 0, needPay, additional);
  cc.balance += cc.changed;

  let paymentAccount = accounts.get(cc.payBy);
  let payCCTransaction = new Transaction({
    date: additional.currentDay,
    amount: needPay,
    category: Constant.paymentCategory.ccPayment,
    description: description,
    type: Constant.transactionType.debit,
    payBy: paymentAccount._id + '',
    payTo: cc._id + '',
    pendingDay: 0
  });
  updateBalance(paymentAccount, payCCTransaction, additional);

  additional.currentTransactions.push(payCCTransaction);
}

const payCreditCard = (accounts: Map<string, Account>, additional: AccountAddi) => {
  for (let obj of accounts) {
    let account = obj[1];
    if (account.type === Constant.accountType.cc) {
      if (Utils.isEarlier(account.dueDate, additional.currentDay)) {
        account.dueDate = Utils.nextDateOfDay(account.dueDate, additional.currentDay);
      }
      if (Utils.isSameDay(account.dueDate, additional.currentDay)) {
        makeDueDatePayment(account, accounts, additional);
        account.dueDate = Utils.dateFormat(account.dueDate).add(1, 'months'); // update dueDate to next month
      }
      // convert balance to Last Statement balance in closing date
      if (Utils.isEarlier(account.closingDate, additional.currentDay)) {
        account.closingDate = Utils.nextDateOfDay(account.closingDate, additional.currentDay);
      }
      if (Utils.isSameDay(account.closingDate, additional.currentDay)) {
        account.lastStatementBalance += account.balance;
        account.closingDate = Utils.dateFormat(account.closingDate).add(1, 'months'); // update closingDate to next month
      }
    }
  }
}

const predict = (accounts: Map<string, Account>, transactions: Transaction[], recurrings: Recurring[],
  endDate: moment.Moment, startDate: moment.Moment, forceCalAll: boolean): PreditReport => {
  if (_.isNil(endDate) || _.isNil(startDate) || endDate.diff(startDate, 'days') < 0) {
    console.warn('invalid date input for predict', startDate, endDate);
    return;
  }

  let additional: AccountAddi = {
    lowestBalanceAccounts: new Map(),
    financialTrouble: false,
    currentDay: startDate,
    currentTransactions: []
  };

  // went thru eveyday, TODO: may optimize?
  let duration = endDate.diff(startDate, 'days');
  let statements: Statement[] = [];

  while (endDate.diff(startDate, 'days') >= 0) {
    additional.currentTransactions.length = 0;
    // delete changed prop
    deleteChanged(accounts);
    // convert pending transaction to balance
    convertPendingToBalance(accounts, additional);
    // deduct one-time payments
    deductOTPayments(accounts, transactions, additional);
    // deduct recurring payments
    deductRecurringPayments(accounts, recurrings, additional);
    // Check wether should pay the credit card
    payCreditCard(accounts, additional);
    // check financial trouble
    isAccountsTrouble(accounts, additional);
    // push current statement to statements if there is blance change and after start date
    if (additional.currentTransactions.length > 0) {
      let statement: Statement = {
        date: additional.currentDay,
        transactions: additional.currentTransactions,
        accounts: Array.from(accounts.values())
      };
      statements.push(Utils.copy(statement));
    }
    // stop if finance alert and forceCal not allow
    if (additional.financialTrouble && !forceCalAll) break;

    additional.currentDay.add(1, 'days');
  }
  
  return {
    statements, 
    lowestBalanceAccounts: Array.from(additional.lowestBalanceAccounts), 
    financialTrouble: additional.financialTrouble
  };
}

export default async (req, res) => {
  let startDate: moment.Moment = Utils.dateFormat(req.query.startDate) || moment();
  let endDate: moment.Moment = Utils.dateFormat(req.query.endDate);
  let forceCalAll: boolean = !_.isNil(req.query.forceCalAll) ? JSON.parse(req.query.forceCalAll) : false;

  if (_.isNil(endDate)) {
    res.json({ err: 'endDate not given' });
    return;
  }

  let accounts = new Map();
  (await AccountModel.find()).forEach(account => accounts.set(account._id + '', account));
  let transactions = await TransactionModel.find().sort('date');
  let recurrings = await RecurringModel.find();

  res.json(predict(accounts, transactions, recurrings, endDate, startDate, forceCalAll));
}