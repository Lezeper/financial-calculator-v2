import * as React from 'react';
import { Table, Header, Grid, Form, Icon, Dimmer, Loader } from 'semantic-ui-react';
import * as _ from 'lodash';

import * as predictService from './Predict.service';
import * as Utils from '../../utils';

import AccountModel from '../Account/Account.model';
import TransactionModel from '../Payment/Transaction.model';

export default class PredictModule extends React.Component {
  state = {
    endDate: '',
    statements: [],
    accountIdNameMap: new Map(),
    forceCalAll: false,
    lowestBalanceAccounts: [],
    loading: false
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  getPendingColumn = (account: AccountModel) => {
    if (!_.isNil(account.pendingTransactions)) {
      return account.pendingTransactions.map(p => p.amount + ', ');
    }
    return '/';
  }

  predict = () => {
    this.setState({loading: true});
    predictService.predict(this.state.endDate + '', this.state.forceCalAll)
      .then((report: Utils.PreditReport) => {
        let accountIdNameMap = new Map();
        if (report && report.statements.length > 0) {
          report.statements[0].accounts.forEach(account => {
            accountIdNameMap.set(account._id, Utils.getAccountName(account));
          });
        }
        this.setState({ 
          statements: report.statements, 
          accountIdNameMap, 
          lowestBalanceAccounts: report.lowestBalanceAccounts,
          loading: false
        });
      });
  }

  render() {
    return (
      <Grid padded>
        <Dimmer page={true} active={this.state.loading}><Loader></Loader></Dimmer>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form>
              <Form.Field width={5}>
                <label>Predit End Date</label>
                <Form.Input type="date" value={this.state.endDate} onChange={this.handleChange} name="endDate" />
              </Form.Field>
              <Form.Field>
                <Form.Group>         
                  <Form.Button content="Predict" onClick={this.predict} primary={true} />
                  <Form.Checkbox toggle label="Force?" onChange={() => this.setState({ forceCalAll: !this.state.forceCalAll })} />
                </Form.Group>
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Header as='h3'>Account Lowest Balance History</Header>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Account</Table.HeaderCell>
                  <Table.HeaderCell>Balance</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  this.state.lowestBalanceAccounts.length > 0 ? 
                  this.state.lowestBalanceAccounts.map(obj => 
                    <Table.Row key={obj[0]}>
                      <Table.Cell>{obj[1].accountName}</Table.Cell>
                      <Table.Cell error={obj[1].balance < 0}>
                        {
                          obj[1].balance < 0 ? <Icon name='attention' /> : null
                        }
                        {Utils.currencyColFormat(obj[1].balance)}
                      </Table.Cell>
                      <Table.Cell>{Utils.dateDisplay(obj[1].date)}</Table.Cell>
                    </Table.Row>
                  ) : null 
                }
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        {
          this.state.statements.length > 0 ?
            this.state.statements.map((statement: Utils.Statement, i) =>
              <Grid.Row key={i}>
                <Grid.Column>
                  <Header as='h3'>{Utils.dateDisplay(statement.date)}</Header>
                  <Table celled key={statement.date + ''}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Balance</Table.HeaderCell>
                        <Table.HeaderCell>Pendings</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {
                        statement.accounts.map((account: AccountModel) =>
                          <Table.Row key={account._id}>
                            <Table.Cell>{Utils.getAccountName(account)}</Table.Cell>
                            <Table.Cell>{account.type}</Table.Cell>
                            {
                              account.changed ?
                                <Table.Cell positive={account.changed > 0} negative={account.changed < 0}>
                                  {Utils.currencyColFormat(account.balance)} ({Utils.currencyColFormat(account.changed)})
                              </Table.Cell> :
                                <Table.Cell error={account.balance < 0}>{Utils.currencyColFormat(account.balance)}</Table.Cell>
                            }
                            <Table.Cell>{this.getPendingColumn(account)}</Table.Cell>
                          </Table.Row>
                        )
                      }
                    </Table.Body>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Balance</Table.HeaderCell>
                        <Table.HeaderCell>Flow</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {
                        statement.transactions.map((transaction: TransactionModel, i) =>
                          <Table.Row key={i}>
                            <Table.Cell>{transaction.description}</Table.Cell>
                            <Table.Cell>{transaction.type}</Table.Cell>
                            <Table.Cell>{Utils.currencyColFormat(transaction.amount)}</Table.Cell>
                            <Table.Cell>
                              {Utils.getTranFlow(transaction.payBy, transaction.payTo, transaction.type, this.state.accountIdNameMap)}
                            </Table.Cell>
                          </Table.Row>
                        )
                      }
                    </Table.Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
            ) : null
        }
      </Grid>
    )
  }
}