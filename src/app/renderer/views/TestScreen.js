import React, {Component} from 'react';

import db from '../../shared/db';
import {AccountSchema} from '../../shared/db/schema';

export default class TestRealmScreen extends Component {
  constructor(props) {
    super(props);
    this.accounts = db.objects(AccountSchema.name);
    this.state = {accounts: this.accounts.length};
  }

  _updateView = () => this.setState({accounts: this.accounts.length});

  componentDidMount = () => this.accounts.addListener(this._updateView);

  componentWillUnmount = () => this.accounts.removeListener(this._updateView);

  _create = () => {
    db.write(() => {
      db.create(AccountSchema.name, {
        name: `name ${this.state.accounts}`,
        address: `address ${this.state.accounts}`,
      }, true);
    });
  };

  render = () => (
    <div>
      <h1>test `realm`</h1>
      <br/>
      <p>accounts: {this.state.accounts}</p>
      <a href="#" onClick={this._create}>Create</a>
    </div>
  );
}
