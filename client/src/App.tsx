import * as React from 'react';
import { Redirect, Route, Switch } from "react-router";
import { NavLink } from "react-router-dom";
import { Icon, Menu } from "semantic-ui-react";

import AccountModule from './components/Account/Account.module';
import PaymentModule from './components/Payment/Payment.module';
import PredictModule from './components/Predict/Predict.module';
import SettingsModule from './components/Settings/Settings.module';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Menu
          icon="labeled"
          widths={4}
          style={{
            flexShrink: 0, // don't allow flexbox to shrink it
            borderRadius: 0, // clear semantic-ui style
            margin: 0 // clear semantic-ui style
          }}>
          <Menu.Item as={NavLink} to="/account/">
            <Icon name="money" />
            Accounts
          </Menu.Item>
          <Menu.Item as={NavLink} to="/payment/">
            <Icon name="payment" />
            Payments
          </Menu.Item>
          <Menu.Item as={NavLink} to="/predict/">
            <Icon name="calculator" />
            Calculator
          </Menu.Item>
          <Menu.Item as={NavLink} to="/settings/">
            <Icon name="settings" />
            Settings
          </Menu.Item>
        </Menu>
        <div
          style={{
            flexGrow: 1,
            overflowX: "hidden",
            overflowY: "auto",
            marginTop: "15px"
          }}>
          <Switch>
            <Route path="/account" component={AccountModule} />
            <Route path="/payment" component={PaymentModule} />
            <Route path="/predict" component={PredictModule} />
            <Route path="/settings" component={SettingsModule} />
            <Redirect from="/" to="/account" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
