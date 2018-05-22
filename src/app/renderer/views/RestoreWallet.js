import React, {Component} from 'react';

import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';

import {deleteWallet, restoreWallet} from "../actions/wallet";
import {navToHome} from "../actions/navigation";

import {DICT_EN} from "../constants/dictionary";
import RecoveryPhraseTextArea from "./recovery-phrase-textarea/RecoveryPhraseTextArea";

import style from './RestoreWallet.css';

class RestoreWallet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      walletName: '',
    };

    this.handleWalletNameChange = this.handleWalletNameChange.bind(this);
    this._restore = this._restore.bind(this);
    this._delete = this._delete.bind(this);
  }

  _restore() {
    this.props.restoreWallet({
      name: this.state.walletName
    });
    this.props.navToHome();
  }

  _delete() {
    this.props.deleteWallet();
    this.props.navToHome();
  }

  handleWalletNameChange(event) {
    this.setState({
      walletName: event.target.value
    })
  }

  render() {
    return (
      <div className={style.RestoreWallet}>
        <div className={style.Caption}>
          <h1>RESTORE WALLET</h1>
        </div>
        <div>
          <p>Wallet name</p>
          <input value={this.state.walletName} onChange={this.handleWalletNameChange}/>
        </div>
        <div className={style.RecoveryPhrase}>
          <p>Recovery phrase</p>
          <RecoveryPhraseTextArea dictionary={DICT_EN}/>
        </div>

        <a href="#" onClick={this._restore}>restore</a>
        <a href="#" onClick={this._delete}>delete</a>
        <a href="#" onClick={this.props.back}>back</a>
      </div>
    );
  }
}

export default connect(null, dispatch => ({
  back: () => dispatch(goBack()),
  navToHome: () => dispatch(navToHome()),
  restoreWallet: (wallet) => dispatch(restoreWallet(wallet)),
  deleteWallet: () => dispatch(deleteWallet()),
}))(RestoreWallet);
