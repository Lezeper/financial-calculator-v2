// https://github.com/plaid/plaid-node

import * as _ from 'lodash';
import { Account, AccountModel } from '../models/account';
const plaid = require('plaid');

// Initialize client
const plaidClient = new plaid.Client(
  process.env.PLAID_CLIENT_ID, 
  process.env.PLAID_SECRET, 
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.development, 
  {version: process.env.PLAID_VERSION});


export const getAccount = async (req, res) => {
  if(!_.isNil(req.query.id) || !_.isNil(req.query.mask)) {
    const account = await AccountModel.findById(req.query.id);
    if(_.isNil(account)) return res.status(500).send('account id invalid');

    plaidClient.getAccounts(account.accessToken, (err, {accounts}) => {
      if(err) return res.status(500).send(err);
      
      for(let i = 0; i < accounts.length; i++) {
        if(accounts[i].mask == req.query.mask) {
          return res.json(accounts[i]);
        }
      }

      return res.status(500).send('account mask', req.query.mask, 'not found');
    });
  } else {
    res.status(500).send('account id or mask not given');
  }
}