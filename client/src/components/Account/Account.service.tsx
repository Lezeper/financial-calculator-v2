import axios from 'axios';

import AccountModel from './Account.model';

import * as Utils from '../../utils';
import Constant from '../../utils/constant';

export const getAccounts = () => {
  return axios.get(`${Constant.restURL}/accounts`)
    .then(({data}) => {
      console.log(data)
      let accounts: any = [];
      data.map(jsonObj => {
        let r: any = Utils.deserializeObject(jsonObj, AccountModel);
        accounts.push(r);
      });
      return accounts;
    });
}

export const getAccountsNameIdMap = () => {
  return axios.get(`${Constant.restURL}/accounts`)
    .then(({data}) => {
      console.log(data)
      let accountsNameIdMap = new Map();
      data.forEach(jsonObj => {
        let r: any = Utils.deserializeObject(jsonObj, AccountModel);
        accountsNameIdMap.set(r._id, Utils.getAccountName(r));
      });
      return accountsNameIdMap;
    });
}

// export const getAccountsNameIdOptions = () => {
//   return axios.get(`${Constant.restURL}/accounts`)
//     .then(({data}) => {
//       console.log(data)
//       let accountsNameIdSet: any = [];
//       data.map(jsonObj => {
//         let r: any = Utils.deserializeObject(jsonObj, AccountModel);
//         accountsNameIdSet.push({key: r._id, text: r.accountName + ' - ' + r.type, value: r._id});
//       });
//       return accountsNameIdSet;
//     });
// }

export const createAccount = (account: AccountModel) => {
  return axios.post(`${Constant.restURL}/account`, account)
    .then(res => {
      return res;
    });
}