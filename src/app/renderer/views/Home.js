import React, {Component} from 'react';
import {connect} from 'react-redux';

import style from './Home.css';

class Home extends Component {
  render() {
    return (
      <div className={style.Home}>
        {!!this.props.wallet.activeWallet && (
          <span>{this.props.wallet.activeWallet.name}</span>
        )}
        {!this.props.wallet.activeWallet && (
          <span>No existing wallet, please restore wallet</span>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  wallet: state.wallet
}))(Home);
