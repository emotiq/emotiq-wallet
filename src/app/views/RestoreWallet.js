import React, {Component} from 'react';
import './RestoreWallet.css';

import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';

import {DICT_EN} from "../constants/dictionary";
import RecoveryPhraseTextArea from "./recovery-phrase-textarea/RecoveryPhraseTextArea";

class RestoreWallet extends Component {

  render() {
    return (
      <div className="RestoreWallet">
        <div className="Caption">
          <h1>RESTORE WALLET</h1>
        </div>
        <div>
          <p>Wallet name</p>
          <input/>
        </div>
        <div className="RecoveryPhrase">
          <p>Recovery phrase</p>
          <RecoveryPhraseTextArea dictionary={DICT_EN}/>
        </div>

        <a href="#" onClick={this.props.back}>back</a>
      </div>
    );
  }
}

export default connect(null, dispatch => ({
  back: () => dispatch(goBack()),
}))(RestoreWallet);
