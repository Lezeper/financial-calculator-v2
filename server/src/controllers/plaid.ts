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

export const syncUpAll = async (req, res) => {
  const _accounts = await AccountModel.find({ type: { $ne: "gc" }});
    for(let i = 0; i < _accounts.length; i++) {
      if(!_.isNil(_accounts[i].accessToken)) {
        try {
          await plaidClient.getAccounts(_accounts[i].accessToken, async(err, {accounts}) => {
            if(err) return res.status(500).send(err);
            
            for(let j = 0; j < accounts.length; j++) {
              if(_accounts[i].mask == accounts[j].mask) {
                _accounts[i].balance = accounts[j].balances.current;
                _accounts[i].avaliableBalance = accounts[j].balances.available;
                _accounts[i].creditLine = accounts[j].balances.limit;
                await _accounts[i].save();
                break;
              }
            }
          });
        } catch(err) {
          res.status(500).send(err);
        }
      }
    }
  res.json();
}