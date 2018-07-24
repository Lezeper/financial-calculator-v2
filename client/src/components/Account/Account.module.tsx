import * as React from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react'

import { getAccountsNameIdMap, getAccounts, createAccount } from './Account.service';
import AccountComponent from './Account.component';
import AccountModel from './Account.model';

import * as Utils from '../../utils';
import Constant from '../../utils/constant';

export default class AccountModule extends React.Component {
  state = {
    accounts: [],
    accountsNameIdOptions: [],
    transactionTypes: [],
    paymentCategory: [],
    recurringPeriod: [],
    accountsNameIdMap: new Map(),
    loading: true
  }

  componentDidMount() {
    Promise.all([
      getAccounts(),
      getAccountsNameIdMap()
    ]).then(res => {
      console.log(res);
      this.setState({
        accounts: res[0], 
        accountsNameIdMap: res[1],
        accountsNameIdOptions: Utils.getAccountsNameIdOptions(res[1]),
        transactionTypes: Utils.objectToOptions(Constant.transactionType),
        paymentCategory: Utils.objectToOptions(Constant.paymentCategory),
        recurringPeriod: Utils.objectToOptions(Constant.recurringPeriod),
        loading: false
      });
    });
  }

  onSubmit = (obj: AccountModel) => {
    console.log(obj);
    obj.updatedDate = new Date();
    obj.order = obj.order ? obj.order : 0;
    createAccount(obj).then(res => {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <Dimmer page={true} active={this.state.loading}><Loader></Loader></Dimmer>
        <AccountComponent
          transactionTypes={this.state.transactionTypes}
          paymentCategory={this.state.paymentCategory}
          recurringPeriod={this.state.recurringPeriod}
          accountsNameIdOptions={this.state.accountsNameIdOptions}
          onSubmit={this.onSubmit}>
        </AccountComponent>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Balance</Table.HeaderCell>
              <Table.HeaderCell>Updated</Table.HeaderCell>
              <Table.HeaderCell>PayBy</Table.HeaderCell>
              <Table.HeaderCell>DueDate</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.state.accounts.length > 0 ?
                this.state.accounts.map((account: AccountModel) => {
                  return (
                    <Table.Row key={account._id}>
                      <Table.Cell>{Utils.getAccountName(account)}</Table.Cell>
                      <Table.Cell>{account.type}</Table.Cell>
                      <Table.Cell>${account.balance}</Table.Cell>
                      <Table.Cell>{Utils.dateDisplay(account.updatedDate)}</Table.Cell>
                      <Table.Cell>{this.state.accountsNameIdMap.get(account.payBy)}</Table.Cell>
                      <Table.Cell>{account.dueDate}</Table.Cell>
                    </Table.Row>
                  )
                }) : null
            }
          </Table.Body>
        </Table>
      </div>
    );
  }
}