import React, {Component} from 'react';
import './CreateWallet.css';

import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';

class CreateWallet extends Component {
  render() {
    return (
      <div className="CreateWallet">
        <h1>Create new wallet</h1>
        <br/>
        <a href="#" onClick={this.props.back}>back</a>
      </div>
    );
  }
}

export default connect(null, dispatch => ({
  back: () => dispatch(goBack()),
}))(CreateWallet);
