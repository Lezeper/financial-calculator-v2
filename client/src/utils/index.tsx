import * as moment from 'moment';
import TransactionModel from '../components/Payment/Transaction.model';
import AccountModel from '../components/Account/Account.model';
import Constant from './constant';

interface Constructable<T> {
  new(...params: any[]): T;
}

function createObject<T>(ctor: Constructable<T>): T {
  return new ctor();
}

export const deserializeObject = (jsonObj: any, clazz) => {
  let newClass = createObject(clazz);
  Object.keys(jsonObj).forEach(key => {
    newClass[key] = jsonObj[key];
  });
  return newClass;
}

export const objectToOptions = (obj: any): { key, value, text }[] => {
  return Object.keys(obj).map(key => {
    return { key: key, value: obj[key], text: obj[key] };
  })
}

export const copy = (obj) => JSON.parse(JSON.stringify(obj))

export const addOthersAccountOption = (accountsNameIdOptions: any[]) => {
  let tmp = copy(accountsNameIdOptions);
  tmp.push({ key: 'Others', value: 'Others', text: 'Others' });
  return tmp;
}

export type PreditReport = {
  statements: Statement[],
  lowestBalanceAccounts: Map<string, { date, balance, accountName }>,
  financialTrouble: boolean,
}

export type Statement = {
  date: moment.Moment,
  transactions: TransactionModel[],
  accounts: AccountModel[]
}

export const dateDisplay = (date: any, format: string = Constant.dateDisplayFormat): string => {
  return moment(date).format(format);
}

export const getAccountName = (account: AccountModel) => {
  return `${account.accountName}(${account.mask})`;
}

export const getAccountsNameIdOptions = (accountsNameIdMap) => {
  let accountsNameIdSet: any[] = [];
  accountsNameIdMap.forEach((v, k) => {
    accountsNameIdSet.push({key: k, text: v, value: k});
  });
  return accountsNameIdSet;
}

export const getTranFlow = (payById: string, payToId: string, transactionType: string, accountIdNameMap: Map<string, string>) => {
  let payByAccountName = accountIdNameMap.get(payById) || 'Others';
  let payToAccountName = accountIdNameMap.get(payToId) || 'Others';

  if(transactionType === Constant.transactionType.debit) {
    return `${payByAccountName} -> ${payToAccountName}`
  }
  return `${payToAccountName} -> ${payByAccountName}`
}

export const currencyColFormat = (val: number) => {
  return val >= 0 ? `$${val.toFixed(2)}` : `-$${val.toFixed(2).substring(1)}`;
}