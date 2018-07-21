import * as moment from 'moment';
import * as _ from 'lodash';

import { Transaction } from '../models/transaction';

export const startWithDay = (date: moment.Moment) => {
  return date.startOf('day');
}

export const dateFormat = (date: any): moment.Moment => {
  if(_.isNil(date)) return date;
  if(moment.isMoment(date)) return startWithDay(date);
  return startWithDay(moment(date)); 
}

export const isEarlier = (date1: moment.Moment, date2: moment.Moment): boolean => {
  date1 = dateFormat(date1);
  date2 = dateFormat(date2);
  return date2.diff(date1, 'days') > 0;
}

export const isLater = (date1: moment.Moment, date2: moment.Moment): boolean => {
  date1 = dateFormat(date1);
  date2 = dateFormat(date2);
  return date1.diff(date2, 'days') > 0;
}

export const copy = (obj: any): any => {
  let c = JSON.parse(JSON.stringify(obj));
  return moment.isMoment(obj) ? dateFormat(c) : c;
}

export const isSameDay = (date1: moment.Moment, date2: moment.Moment): boolean => {
  date1 = dateFormat(date1);
  date2 = dateFormat(date2);
  return date1.diff(date2, 'days') === 0;
}

export const isTargetDateBetween = (startDate: moment.Moment, endDate: moment.Moment, targetDate: moment.Moment) => {
  startDate = dateFormat(startDate);
  endDate = dateFormat(endDate);
  targetDate = dateFormat(targetDate);
  return targetDate.diff(startDate, 'days') >= 0 && endDate.diff(targetDate, 'days') >= 0;
}

export const nextDateOfDay = (date: moment.Moment, currentDate: moment.Moment) => {
  let curr = copy(currentDate);
  let day = dateFormat(date).date();
  if(curr.date(day).diff(currentDate, 'days') > 0) return curr.date(day);
  return curr.date(day).add(1, 'months');
}

export const spreadModel = (model) => {
  return {...model}['_doc'] || {...model};
}