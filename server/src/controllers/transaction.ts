import { Transaction, TransactionModel } from '../models/transaction';

export const getTransactions = async (req, res) => {
  res.json(await TransactionModel.find());
}

export const createTransaction = async (req, res) => {
  res.json(await new TransactionModel({...req.body}).save());
}

export const updateTransaction = async(req, res) => {
  res.json(await TransactionModel.findByIdAndUpdate(req.body._id, {...req.body}));
}

export const deleteTransaction = async(req, res) => {
  await TransactionModel.findByIdAndRemove(req.params.id);
  res.json();
}