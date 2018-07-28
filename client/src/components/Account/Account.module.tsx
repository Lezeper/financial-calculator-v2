import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Table, Dimmer, Loader, Button } from 'semantic-ui-react'

import * as AccountService from './Account.service';
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
    loading: true,
    redirectTo: null
  }

  componentDidMount() {
    Promise.all([
      AccountService.getAccounts(),
      AccountService.getAccountsNameIdMap()
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

  onRedirect = () => {
    let route = this.state.redirectTo || null;
    if (!route) return null;
    return <Redirect from="/account" to={route} />
  }

  onSubmit = (obj: AccountModel) => {
    console.log(obj);
    obj.updatedDate = new Date();
    obj.order = obj.order ? obj.order : 0;
    AccountService.createAccount(obj).then(res => {
      this.setState({redirectTo: '/'});
      console.log(res);
    });
  }

  updateAccount = (obj: AccountModel) => {
    // return console.log(obj)
    AccountService.updateAccount(obj).then(res => {
      this.setState({redirectTo: '/'});
      console.log(res);
    });
  }

  deleteAccount = (id) => {
    AccountService.deleteAccount(id).then(res => {
      this.setState({redirectTo: '/'});
    });
  }

  render() {
    return (
      this.state.redirectTo ? this.onRedirect() :
        <div>
          <Dimmer page={true} active={this.state.loading}><Loader></Loader></Dimmer>
          <AccountComponent
            transactionTypes={this.state.transactionTypes}
            paymentCategory={this.state.paymentCategory}
            recurringPeriod={this.state.recurringPeriod}
            accountsNameIdOptions={this.state.accountsNameIdOptions}
            isCircular={false}
            headerText={'Add a account'}
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
                <Table.HeaderCell></Table.HeaderCell>
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
                        <Table.Cell>
                          <AccountComponent
                            transactionTypes={this.state.transactionTypes}
                            paymentCategory={this.state.paymentCategory}
                            recurringPeriod={this.state.recurringPeriod}
                            accountsNameIdOptions={this.state.accountsNameIdOptions}
                            iconName={'edit'}
                            isCircular={true}
                            headerText={'Update account'}
                            account={account}
                            onSubmit={this.updateAccount}>
                          </AccountComponent>
                          <Button circular icon="remove" onClick={() => this.deleteAccount(account._id)}></Button>
                        </Table.Cell>
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