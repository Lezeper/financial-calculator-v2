import * as moment from 'moment';

import Constant from '../../utils/constant';
import TransactionModel from '../Payment/Transaction.model';

export default class Account {
  _id?: string;
  type: string = '';
  mask: string = '';
  accountName: string = '';
  updatedDate: moment.Moment | Date | string = '';
  order: number = 0;
  balance: number = 0;

  dueDate?: moment.Moment | Date | string = moment().format(Constant.datepickerFormat);
  closingDate?: moment.Moment | Date | string = moment().format(Constant.datepickerFormat);
  creditLine?: number = 0;
  apr0Date?: { startDate: moment.Moment | Date | string, endDate: moment.Moment | Date | string } | null | undefined;
  lastStatementBalance?: number = 0;
  avaliableBalance? : number = 0;
  minPayment?: number = 0;
  payBy?: string = '';
  pendingTransactions?: Array<TransactionModel> = [];

  changed?: number = 0;
}