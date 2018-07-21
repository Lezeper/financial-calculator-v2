import { Recurring, RecurringModel } from '../models/recurring';

export const getRecurrings = async (req, res) => {
  res.json(await RecurringModel.find());
}

export const createRecurring= async (req, res) => {
  res.json(await new RecurringModel({...req.body}).save());
}

export const updateRecurring = async(req, res) => {
  res.json(await RecurringModel.findByIdAndUpdate(req.body._id, {...req.body}));
}

export const deleteRecurring = async(req, res) => {
  await RecurringModel.findByIdAndRemove(req.params.id);
  res.json();
}