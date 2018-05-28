import React, {Component} from 'react';
import {connect} from 'react-redux';

import {RECOVERY_PHRASE_LENGTH} from '../../constants/config';

import {navToHome} from '../../actions/navigation';
import {restoreWallet} from '../../actions/wallet';

import style from './RecoveryPhrase.css';

const WORD_ID_PREFIX = 'word';

class RestoreWallet extends Component {

  constructor(props) {
    super(props);

    let words = [];
    for (let i = 0; i < RECOVERY_PHRASE_LENGTH; ++i) {
      words.push({id: i, value: ''});
    }
    this.state = {
      words: words,
    };
  }

  _handleChangeWord = (event) => {
    let id = event.target.id.substring(WORD_ID_PREFIX.length);
    let words = this.state.words.slice();//copy
    words[+id].value = event.target.value;
    this.setState({words: words});
  };

  _cancel = () => {
    const {onCancel} = this.props;
    let words = [];
    for (let i = 0; i < RECOVERY_PHRASE_LENGTH; ++i) {
      words.push({id: i, value: ''});
    }
    this.setState({words: words});
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  render = () =>
    <div>
      <h1 className={style.Header}>RESTORE WALLET</h1>
      <p className={style.Description}>In order to restore a wallet please enter words from its recovery phrase in
        correct order. The phrase
        is case sensitive.</p>
      <div className={style.RecoveryPhrasePanel}>
        {this.state.words.map(el => <div key={el.id} className={style.RecoveryPhraseWordWrapper}>
          <span>{el.id + 1}. </span>
          <input
            id={WORD_ID_PREFIX + el.id}
            className={style.RecoveryPhraseWord}
            onChange={this._handleChangeWord}
            value={el.value}/>
        </div>)}
      </div>
      <div className={style.ButtonPanel}>
        <div className={style.ButtonWrapper} onClick={this._cancel}>
          <button>Cancel</button>
        </div>
        <div className={style.ButtonWrapper}>
          <button onClick={() => this.props.restoreWallet(this.state.words.map(w => w.value).join(' '))}>Restore
            wallet
          </button>
        </div>
      </div>
    </div>;
}

export default connect(null, dispatch => ({
  restoreWallet: (recoveryPhrase) =>
    dispatch(restoreWallet(recoveryPhrase))
      .then(() => dispatch(navToHome()))
      .catch((mes) => alert(mes)),
}))(RestoreWallet);
