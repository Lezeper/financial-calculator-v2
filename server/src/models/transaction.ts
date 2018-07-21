import * as moment from 'moment';
import * as _ from 'lodash';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

import { dateFormat } from '../utils';

export class Transaction extends Typegoose{
  _id?: string;
  @prop({ required: true })
  type: string;
  @prop({ required: true })
  category: string;
  @prop({ required: true })
  description: string;
  @prop({ required: true })
  date: moment.Moment;
  @prop({ required: true })
  amount: number;
  @prop({ required: true })
  payBy: string;
  @prop({ required: true })
  payTo: string; // it maybe account id or null for others
  @prop({ required: true })
  pendingDay: number;

  constructor(obj?: any) {
    super();
    
    if(_.isNil(obj)) {
      console.warn('invalid obj for Payment');
      return;
    }

    this._id = obj._id;
    this.type = obj.type;
    this.category = obj.category;
    this.description = obj.description;
    this.date = dateFormat(obj.date);
    this.amount = obj.amount;
    this.payBy= obj.payBy;
    this.payTo = obj.payTo;
    this.pendingDay = obj.pendingDay;
  }
}

export const TransactionModel = new Transaction({}).getModelForClass(Transaction);