import axios from 'axios';

// import TransactionModel from '../Payment/Transaction.model';
// import AccountModel from '../Account/Account.model';
// import * as Utils from '../../utils';
import Constant from '../../utils/constant';


export const predict = (endDate: string, forceCalAll: boolean) => {
  return axios.get(`${Constant.restURL}/predict?endDate=${endDate}&forceCalAll=${forceCalAll}`)
    .then((res) => {
      console.log(res.data)
      return res.data;
    });
}