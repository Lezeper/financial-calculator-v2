import axios from 'axios';

import TransactionModel from './Transaction.model';
import RecurringModel from './Recurring.model';
import * as Utils from '../../utils';
import Constant from '../../utils/constant';

export const getTransactions = () => {
  return axios.get(`${Constant.restURL}/transactions`)
    .then(({data}) => {
      console.log(data)
      let transactions: any = [];
      data.map(jsonObj => {
        let r: any = Utils.deserializeObject(jsonObj, TransactionModel);
        transactions.push(r);
      });
      return transactions;
    });
}

export const getRecurrings = () => {
  return axios.get(`${Constant.restURL}/recurrings`)
    .then(({data}) => {
      console.log(data)
      let recurrings: any = [];
      data.map(jsonObj => {
        let r: any = Utils.deserializeObject(jsonObj, RecurringModel);
        recurrings.push(r);
      });
      return recurrings;
    });
}

export const createTransaction = (transaction: TransactionModel) => {
  return axios.post(`${Constant.restURL}/transaction`, transaction)
    .then(res => {
      return res;
    });
}

export const createRecurring = (recurring: RecurringModel) => {
  return axios.post(`${Constant.restURL}/recurring`, recurring)
    .then(res => {
      return res;
    });
}

export const deleteTransaction = (id) => {
  return axios.delete(`${Constant.restURL}/transaction/${id}`)
    .then(res => {
      console.log(res);
      return res;
    });
}

export const deleteRecurring = (id) => {
  return axios.delete(`${Constant.restURL}/recurring/${id}`)
    .then(res => {
      console.log(res);
      return res;
    });
}