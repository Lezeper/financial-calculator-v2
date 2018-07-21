import * as moment from 'moment';
import * as _ from 'lodash';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

import { dateFormat } from '../utils';

export class Recurring extends Typegoose{
  _id?; string;
  @prop({ required: true })
  type: string;
  @prop({ required: true })
  category: string;
  @prop({ required: true })
  description: string;
  @prop({ required: true })
  recurringDay: string;
  @prop({ required: true })
  recurringPeriod: string;
  @prop({ required: true })
  amount: number;
  @prop({ required: true })
  payBy: string;
  @prop({ required: true })
  payTo: string;
  @prop({ required: true })
  startDate: moment.Moment;
  @prop({ required: true })
  endDate: moment.Moment;
  @prop({ required: true })
  pendingDay: number;

  constructor(obj?: any) {
    super();

    if(_.isNil(obj)) {
      console.warn('invalid obj for Recurring');
      return;
    }

    this._id = obj._id;
    this.type = obj.type;
    this.category = obj.category;
    this.description = obj.description;
    this.recurringDay = obj.recurringDay;
    this.recurringPeriod = obj.recurringPeriod;
    this.amount = obj.amount;
    this.payBy= obj.payBy;
    this.payTo = obj.payTo;
    this.startDate = dateFormat(obj.startDate);
    this.endDate = dateFormat(obj.endDate);
    this.pendingDay = obj.pendingDay;
  }
}

export const RecurringModel = new Recurring({}).getModelForClass(Recurring);