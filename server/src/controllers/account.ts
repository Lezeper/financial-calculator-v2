import { Account, AccountModel } from '../models/account';

export const getAccounts = async (req, res) => {
  res.json(await AccountModel.find());
}

export const createAccount = async (req, res) => {
  res.json(await new AccountModel({...req.body}).save());
}

export const updateAccount = async(req, res) => {
  res.json(await AccountModel.findByIdAndUpdate(req.body._id, new AccountModel({...req.body})));
}

export const deleteAccount = async(req, res) => {
  await AccountModel.findByIdAndRemove(req.params.id);
  res.json();
}