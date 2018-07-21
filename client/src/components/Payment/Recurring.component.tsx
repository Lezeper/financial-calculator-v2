import * as React from "react";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
import * as _ from 'lodash';

import RecurringModel from "./Recurring.model";
import Constant from '../../utils/constant';
import * as Utils from '../../utils';

export default class RecurringComponent extends React.Component<any> {
  state = {
    newRecurring: new RecurringModel(),
    showWeekDay: false,
    weekDays: Utils.objectToOptions(Constant.weekDays),
    payToAccounts: []
  }

  onModalOpen = () => {
    if(!_.isNil(this.props.accountsNameIdOptions)) {
      this.setState({
        payToAccounts: Utils.addOthersAccountOption(this.props.accountsNameIdOptions)
      });
    }
  }

  handleChange = (e, { name, value }) => {
    let newRecurring = this.state.newRecurring;
    newRecurring[name] = value;
    this.setState({ newRecurring });
    
    if(name === 'recurringPeriod') {
      if(value === Constant.recurringPeriod.biWeek || value === Constant.recurringPeriod.weekly) {
        this.setState({ showWeekDay: true });
      } else {
        this.setState({ showWeekDay: false });
      }
    }
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.newRecurring);
  }

  render() {
    return (
      <Modal trigger={<Button onClick={this.onModalOpen}>New Recurring</Button>}>
        <Modal.Header>Add a Recurring</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Field>
                <label>Type</label>
                <Dropdown placeholder="Types" fluid selection options={this.props.transactionTypes} name="type" required
                  value={this.state.newRecurring.type} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Category</label>
                <Dropdown placeholder="Category" fluid selection options={this.props.paymentCategory} name="category" required
                  value={this.state.newRecurring.category} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <Form.Input type="text" placeholder="Description" name="description" required
                  value={this.state.newRecurring.description} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Recurring Period</label>
                <Form.Dropdown placeholder="Recurring Period" fluid selection options={this.props.recurringPeriod} name="recurringPeriod" required
                  value={this.state.newRecurring.recurringPeriod} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Recurring Day</label>
                {
                  this.state.showWeekDay ? 
                  <Dropdown placeholder="Recurring Day" fluid selection options={this.state.weekDays} name="recurringDay" required
                    value={this.state.newRecurring.recurringDay} onChange={this.handleChange} /> :
                  <Form.Input type="text" placeholder="Recurring Day" name="recurringDay" required
                    value={this.state.newRecurring.recurringDay} onChange={this.handleChange} />
                }
              </Form.Field>
              <Form.Field>
                <label>Amount</label>
                <Form.Input type="number" steps="2" placeholder="Amount" name="amount" required
                  value={this.state.newRecurring.amount} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Pay By Account</label>
                <Dropdown placeholder="PayBy" fluid selection options={this.props.accountsNameIdOptions} name="payBy"
                  value={this.state.newRecurring.payBy} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Pay To</label>
                <Dropdown placeholder="PayTo" fluid selection options={this.state.payToAccounts} name="payTo"
                  value={this.state.newRecurring.payTo} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Start Date</label>
                <Form.Input type="date" placeholder="Start Date" name="startDate" required
                  value={this.state.newRecurring.startDate} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>End Date</label>
                <Form.Input type="date" placeholder="End Date" name="endDate" required
                  value={this.state.newRecurring.endDate} onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <label>Pending Days</label>
                <Form.Input type="number" placeholder="Pending Days" name="pendingDay" required
                  value={this.state.newRecurring.pendingDay} onChange={this.handleChange} />
              </Form.Field>
              <Form.Button content="Submit" />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}