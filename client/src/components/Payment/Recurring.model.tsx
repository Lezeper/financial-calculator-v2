import * as moment from 'moment';

import Constant from '../../utils/constant';

export default class RecurringModel {
  _id?: string;
  type: string = '';
  category: string = '';
  description: string = '';
  recurringDay: string = '';
  recurringPeriod: string = '';
  amount: number = 0;
  payBy: string = '';
  payTo: string = '';
  startDate: moment.Moment | string | Date = moment().format(Constant.datepickerFormat);
  endDate: moment.Moment | string | Date = moment().format(Constant.datepickerFormat);
  pendingDay: number = 0;
}