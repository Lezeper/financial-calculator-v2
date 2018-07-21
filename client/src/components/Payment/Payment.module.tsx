import * as React from 'react';
import { Table, Header, Button } from 'semantic-ui-react'

import { getRecurrings, getTransactions, createRecurring, createTransaction, deleteRecurring, deleteTransaction } from './Payment.service';
import { getAccountsNameIdMap } from '../Account/Account.service';
import * as Utils from '../../utils';
import Constant from '../../utils/constant';

import TransactionModel from './Transaction.model';
import RecurringModel from './Recurring.model';

import TransactionComponent from './Transaction.component';
import RecurringComponent from './Recurring.component';

export default class PaymentModule extends React.Component {
  state = {
    recurrings: [],
    transactions: [],
    accountsNameIdOptions: [],
    transactionTypes: [],
    paymentCategory: [],
    recurringPeriod: [],
    accountsNameIdMap: new Map()
  }

  componentDidMount() {
    Promise.all([
      getRecurrings(),
      getTransactions(),
      getAccountsNameIdMap()
    ]).then(res=>{
      this.setState({
        recurrings: res[0], 
        transactions: res[1],
        accountsNameIdMap: res[2],
        accountsNameIdOptions: Utils.getAccountsNameIdOptions(res[2]),
        transactionTypes: Utils.objectToOptions(Constant.transactionType),
        paymentCategory: Utils.objectToOptions(Constant.paymentCategory),
        recurringPeriod: Utils.objectToOptions(Constant.recurringPeriod)
      });
    });
  }

  onTransactionSubmit = (obj: TransactionModel) => {
    console.log(obj);
    createTransaction(obj).then(res => {
      console.log(res);
    });
  }

  onRecurringSubmit = (obj: RecurringModel) => {
    console.log(obj);
    createRecurring(obj).then(res => {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <TransactionComponent
          btnText="New Transaction"
          transactionTypes={this.state.transactionTypes}
          paymentCategory={this.state.paymentCategory}
          accountsNameIdOptions={this.state.accountsNameIdOptions}
          onSubmit={this.onTransactionSubmit}>
        </TransactionComponent>
        <RecurringComponent 
          transactionTypes={this.state.transactionTypes}
          paymentCategory={this.state.paymentCategory}
          accountsNameIdOptions={this.state.accountsNameIdOptions}
          recurringPeriod={this.state.recurringPeriod}
          onSubmit={this.onRecurringSubmit}>
        </RecurringComponent>

        <Header as='h2'>Transactions</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>PD</Table.HeaderCell>
              <Table.HeaderCell>Flow</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.state.transactions.length > 0 ?
                this.state.transactions.map((transaction: TransactionModel) => {
                  return (
                    <Table.Row key={transaction._id}>
                      <Table.Cell>{transaction.date}</Table.Cell>
                      <Table.Cell>{transaction.type}</Table.Cell>
                      <Table.Cell>${transaction.amount}</Table.Cell>
                      <Table.Cell>{transaction.description}</Table.Cell>
                      <Table.Cell>{transaction.pendingDay}</Table.Cell>
                      <Table.Cell>{transaction.payBy} -> {transaction.payTo}</Table.Cell>
                      <Table.Cell>
                        <Button circular icon="remove" onClick={()=>deleteTransaction(transaction._id)}></Button>
                      </Table.Cell>
                    </Table.Row>
                  )
                }) : null
            }
          </Table.Body>
        </Table>

        <Header as='h2'>Recurrings</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Day</Table.HeaderCell>
              <Table.HeaderCell>Period</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>PD</Table.HeaderCell>
              <Table.HeaderCell>Flow</Table.HeaderCell>
              <Table.HeaderCell>Duration</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.state.recurrings.length > 0 ?
                this.state.recurrings.map((recurring: RecurringModel) => {
                  return (
                    <Table.Row key={recurring._id}>
                      <Table.Cell>{recurring.recurringDay}</Table.Cell>
                      <Table.Cell>{recurring.recurringPeriod}</Table.Cell>
                      <Table.Cell>{recurring.type}</Table.Cell>
                      <Table.Cell>${recurring.amount}</Table.Cell>
                      <Table.Cell>{recurring.description}</Table.Cell>
                      <Table.Cell>{recurring.pendingDay}</Table.Cell>
                      <Table.Cell>
                        {Utils.getTranFlow(recurring.payBy, recurring.payTo, recurring.type, this.state.accountsNameIdMap)}
                      </Table.Cell>
                      <Table.Cell>{recurring.startDate} -> {recurring.endDate}</Table.Cell>
                      <Table.Cell>
                        <Button circular icon="remove" onClick={()=>deleteRecurring(recurring._id)}></Button>
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