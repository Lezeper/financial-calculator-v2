import * as React from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";

import Constant from "../../utils/constant";

import AccountModel from "./Account.model";
import TransactionModel from '../Payment/Transaction.model';
import TransactionComponent from '../Payment/Transaction.component';

export default class AccountComponent extends React.Component<any> {
  state = {
    newAccount: new AccountModel(),
    apr0Valid: false
  }
  private accountTypes = [
    { key: Constant.accountType.savings, text: Constant.accountType.savings, value: Constant.accountType.savings },
    { key: Constant.accountType.checking, text: Constant.accountType.checking, value: Constant.accountType.checking },
    { key: Constant.accountType.cc, text: Constant.accountType.cc, value: Constant.accountType.cc },
    { key: Constant.accountType.gc, text: Constant.accountType.gc, value: Constant.accountType.gc }
  ];

  apr0Change = () => {
    let apr0Valid = !this.state.apr0Valid;
    let newAccount = this.state.newAccount;
    if(apr0Valid) {
      newAccount.apr0Date = { startDate: '', endDate: '' };
    } else {
      delete newAccount.apr0Date;
    }
    this.setState({newAccount, apr0Valid});
  }

  updateApr0StartDate = (e, { value }) => {
    let newAccount = this.state.newAccount;
    newAccount.apr0Date!.startDate = value;
    this.setState({newAccount});
  }

  updateApr0EndDate = (e, { value }) => {
    let newAccount = this.state.newAccount;
    newAccount.apr0Date!.endDate = value;
    this.setState({newAccount});
  }

  handleChange = (e, { name, value }) => {
    let changes = { [name]: value };

    if(name === 'type') {
      if(value === Constant.accountType.cc) {
        changes['pendingTransactions'] = [];
      } else {
        changes['pendingTransactions'] = undefined;
      }
    }

    this.setState({newAccount: {...this.state.newAccount, ...changes}});
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.newAccount);
  }

  onPendingTransactionSubmit = (pTransaction: TransactionModel) => {
    let newAccount: AccountModel = this.state.newAccount;
    newAccount.pendingTransactions!.push(pTransaction);
    this.setState({newAccount});
  }

  render() {
    let payByField = (
      <Form.Field>
        <label>Pay By Account</label>
        <Dropdown placeholder="PayBy" fluid selection options={this.props.accountsNameIdOptions} name="payBy"
          value={this.state.newAccount.payBy} onChange={this.handleChange} />
      </Form.Field>
    );
    return (
      <Modal trigger={<Button>New Account</Button>} closeOnDimmerClick={false}>
        <Modal.Header>Add a account</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Account Name</label>
                <Form.Input type="text" placeholder="Account Name" name="accountName" required
                  value={this.state.newAccount.accountName} onChange={this.handleChange} autoComplete="off"/>
              </Form.Field>
              <Form.Field>
                <label>last4Num</label>
                <Form.Input type="number" placeholder="Account last4Num" name="last4Num" required
                  value={this.state.newAccount.last4Num} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Type</label>
                <Dropdown placeholder="Types" fluid selection options={this.accountTypes} name="type" required
                  value={this.state.newAccount.type} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Balance</label>
                <Form.Input type="number" steps="2" placeholder="Account Balance" name="balance" required
                  value={this.state.newAccount.balance} onChange={this.handleChange} />
              </Form.Field>
              {
                this.state.newAccount.type === Constant.accountType.gc ? payByField: null
              }

              {
                this.state.newAccount.type === Constant.accountType.cc ? (
                  <React.Fragment>
                    <Form.Field>
                      <label>Avaliable Balance</label>
                      <Form.Input type="number" placeholder="Avaliable Balance" name="avaliableBalance"
                        value={this.state.newAccount.avaliableBalance} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Credit Line</label>
                      <Form.Input type="number" placeholder="Credit Line" name="creditLine"
                        value={this.state.newAccount.creditLine} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Due Date</label>
                      <Form.Input type="date" placeholder="Due Date" name="dueDate"
                        value={this.state.newAccount.dueDate} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Closing Date</label>
                      <Form.Input type="date" placeholder="Closing Date" name="closingDate"
                        value={this.state.newAccount.closingDate} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Last Statement Balance</label>
                      <Form.Input type="number" placeholder="Last Statement Balance" name="lastStatementBalance"
                        value={this.state.newAccount.lastStatementBalance} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                      <label>Minimum Payment</label>
                      <Form.Input type="number" placeholder="Last Statement Balance" name="minPayment"
                        value={this.state.newAccount.minPayment} onChange={this.handleChange} />
                    </Form.Field>
                    {payByField}
                    <Form.Field>
                      <label>Use APR 0 offer?</label>
                      <Form.Checkbox onChange={this.apr0Change} checked={this.state.apr0Valid}/>
                    </Form.Field>
                    {
                      this.state.apr0Valid ? (
                        <React.Fragment>
                          <Form.Field>
                            <label>APR 0 Start Date</label>
                            <Form.Input type="date" name="startDate"
                              value={this.state.newAccount.apr0Date!.startDate} onChange={this.updateApr0StartDate}/>
                          </Form.Field>
                          <Form.Field>
                            <label>APR 0 End Date</label>
                            <Form.Input type="date" name="endDate"
                              value={this.state.newAccount.apr0Date!.endDate} onChange={this.updateApr0EndDate}/>
                          </Form.Field>
                        </React.Fragment>
                      ) : null
                    }

                    <Form.Field>
                      <label>Pending Transactions</label>
                      <TransactionComponent
                        btnText="New Pending Transaction"
                        transactionTypes={this.props.transactionTypes}
                        paymentCategory={this.props.paymentCategory}
                        accountsNameIdOptions={this.props.accountsNameIdOptions}
                        onSubmit={this.onPendingTransactionSubmit}></TransactionComponent>
                        <br/><br/>
                      {
                        this.state.newAccount.pendingTransactions!.length > 0 ?
                        this.state.newAccount.pendingTransactions!.map((pTransaction: TransactionModel, i: number) => 
                          <TransactionComponent
                            key={i}
                            readOnly={true}
                            btnText={pTransaction.description}
                            transaction={pTransaction}
                            transactionTypes={this.props.transactionTypes}
                            paymentCategory={this.props.paymentCategory}
                            accountsNameIdOptions={this.props.accountsNameIdOptions}
                            onSubmit={this.onPendingTransactionSubmit}></TransactionComponent>
                        ) : null
                      }
                    </Form.Field>
                  </React.Fragment>
                ) : null
              }

              <Form.Button content="Submit" onClick={this.onSubmit}/>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}