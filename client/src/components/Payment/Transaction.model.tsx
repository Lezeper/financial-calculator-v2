import * as moment from 'moment';

import Constant from '../../utils/constant';

export default class Transaction {
  _id?: string;
  type: string = '';
  category: string = '';
  description: string = '';
  date: moment.Moment | string | Date = moment().format(Constant.datepickerFormat);
  amount: number = 0;
  payBy: string = '';
  payTo: string = '';
  pendingDay: number = 0;
}