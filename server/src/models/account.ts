import * as moment from 'moment';
import * as _ from 'lodash';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

import { Transaction } from './transaction';
import { dateFormat } from '../utils';

export class Account extends Typegoose {
  _id?: string;
  @prop({ required: true })
  type: string;
  @prop({ required: true })
  last4Num: number;
  @prop({ required: true })
  accountName: string;
  @prop({ required: true })
  updatedDate: moment.Moment;
  @prop({ required: true })
  order: number;
  @prop({ required: true })
  balance: number;

  @prop()
  dueDate?: moment.Moment;
  @prop()
  closingDate?: moment.Moment;
  @prop()
  creditLine?: number;
  @prop()
  lastStatementBalance?: number;
  @prop()
  avaliableBalance? : number;
  @prop()
  minPayment?: number;
  @prop()
  payBy?: string;
  @prop()
  apr0Date?: { startDate: moment.Moment, endDate: moment.Moment }
  @prop()
  pendingTransactions?: Array<Transaction>;
  @prop()
  changed?: number;

  constructor(obj: any = {}) {
    super();

    if(_.isNil(obj)) {
      console.warn('invalid obj for Account');
      return;
    }

    this._id = obj._id;
    this.type = obj.type;
    this.last4Num = obj.last4Num;
    this.accountName = obj.accountName;
    this.updatedDate = dateFormat(obj.updatedDate);
    this.order = obj.order;
    this.balance = obj.balance;
    this.creditLine = obj.creditLine;
    this.lastStatementBalance = obj.lastStatementBalance;
    this.avaliableBalance = obj.avaliableBalance;
    this.minPayment = obj.minPayment;
    this.payBy = obj.payBy;

    if(obj.pendingTransactions && obj.pendingTransactions.length > 0) {
      this.pendingTransactions.push(new Transaction(obj.pendingTransactions));
    }
    if(obj.apr0Date) {
      this.apr0Date = {
        startDate: moment(obj.startDate),
        endDate: moment(obj.endDate)
      }
    }
    if(obj.dueDate && obj.closingDate) {
      // if dueDate is current month
      let fd = moment(obj.dueDate);
      if(fd.diff(moment()) > 0) {
        this.dueDate = fd;
      } else {
        this.dueDate = fd.subtract(1, 'months');
      }

      let fc = moment(obj.closingDate);
      if(fc.diff(moment()) > 0) {
        this.closingDate = fc;
      } else {
        this.closingDate = fc.subtract(1, 'months');
      }
    }
  }
}

export const AccountModel = new Account({}).getModelForClass(Account);