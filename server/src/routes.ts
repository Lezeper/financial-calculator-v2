import * as express from 'express';
import * as moment from 'moment';

import { getAccounts, createAccount, updateAccount, deleteAccount } from './controllers/account';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from './controllers/transaction';
import { getRecurrings, createRecurring, updateRecurring, deleteRecurring } from './controllers/recurring';
import predict from './controllers/predict';

const router = express.Router();

export default (): express.Router => {
  router.get('/token?', (req, res) => {
    if(req.query.token === process.env.TOKEN) {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  });

  router.get('/predict?', predict);

  router.get('/accounts', getAccounts);
  router.post('/account', createAccount);
  router.put('/account', updateAccount);
  router.delete('/account/:id', deleteAccount);

  router.get('/transactions', getTransactions);
  router.post('/transaction', createTransaction);
  router.put('/transaction', updateTransaction);
  router.delete('/transaction/:id', deleteTransaction);

  router.get('/recurrings', getRecurrings);
  router.post('/recurring', createRecurring);
  router.put('/recurring', updateRecurring);
  router.delete('/recurring/:id', deleteRecurring);

  return router;
}