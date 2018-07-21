import * as React from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
import * as _ from 'lodash';

import TransactionModel from "./Transaction.model";
import * as Utils from '../../utils';

export default class TransactionComponent extends React.Component<any> {
  state = {
    newTransaction: new TransactionModel(),
    isModalOpened: false,
    payToAccounts: []
  }

  closeModal = ($event) => {
    $event.preventDefault();
    this.setState({ isModalOpened: false });
  }

  onModalOpen = () => {
    this.setState({ isModalOpened: true });
    if (!_.isNil(this.props)) {
      if(!_.isNil(this.props.transaction)) {
        this.setState({ newTransaction: this.props.transaction });
      }
      if(!_.isNil(this.props.accountsNameIdOptions)) {
        this.setState({
          payToAccounts: Utils.addOthersAccountOption(this.props.accountsNameIdOptions)
        });
      }
    }
  }

  handleChange = (e, { name, value }) => {
    let newTransaction = this.state.newTransaction;
    newTransaction[name] = value;
    this.setState({ newTransaction });
  }

  onSubmit = ($event) => {
    this.closeModal($event);
    this.props.onSubmit(this.state.newTransaction);
  }

  render() {
    return (
      <Modal trigger={<Button onClick={this.onModalOpen}>{this.props.btnText}</Button>} closeOnDimmerClick={false} open={this.state.isModalOpened}>
        <Modal.Header>Add a transaction</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Type</label>
                <Dropdown placeholder="Types" fluid selection options={this.props.transactionTypes} name="type" required
                  value={this.state.newTransaction.type} onChange={this.handleChange} disabled={this.props.readOnly} />
              </Form.Field>
              <Form.Field>
                <label>Category</label>
                <Dropdown placeholder="Category" fluid selection options={this.props.paymentCategory} name="category" required
                  value={this.state.newTransaction.category} onChange={this.handleChange} disabled={this.props.readOnly} />
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <Form.Input type="text" placeholder="Description" name="description" required
                  value={this.state.newTransaction.description} onChange={this.handleChange} disabled={this.props.readOnly} />
              </Form.Field>
              <Form.Field>
                <label>Date</label>
                <Form.Input type="date" placeholder="Date" name="date" required
                  value={this.state.newTransaction.date} onChange={this.handleChange} disabled={this.props.readOnly} />
              </Form.Field>
              <Form.Field>
                <label>Amount</label>
                <Form.Input type="number" steps="2" placeholder="Amount" name="amount" required
                  value={this.state.newTransaction.amount} onChange={this.handleChange} disabled={this.props.readOnly} />
              </Form.Field>
              <Form.Field>
                <label>Pay By Account</label>
                <Dropdown placeholder="PayBy" fluid selection options={this.props.accountsNameIdOptions} name="payBy"
                  value={this.state.newTransaction.payBy} onChange={this.handleChange} disabled={this.props.readOnly} />
              </Form.Field>
              <Form.Field>
                <label>Pay To</label>
                <Dropdown placeholder="PayTo" fluid selection options={this.state.payToAccounts} name="payTo"
                  value={this.state.newTransaction.payTo} onChange={this.handleChange} disabled={this.props.readOnly} />
              </Form.Field>
              <Form.Field>
                <label>Pending Day</label>
                <Form.Input type="number" placeholder="Pending Day" name="pendingDay" required
                  value={this.state.newTransaction.pendingDay} onChange={this.handleChange} disabled={this.props.readOnly} />
              </Form.Field>
              <Form.Field>
                {
                  this.props.readOnly ? null :
                    <Form.Button content="Submit" onClick={this.onSubmit} />
                }
                <Form.Button content="Cancel" onClick={this.closeModal} />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}