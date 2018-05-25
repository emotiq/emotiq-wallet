import React, {Component} from 'react';
import {connect} from 'react-redux';

import {RECOVERY_PHRASE_LENGTH} from '../../constants/config';

import style from './RecoveryPhrase.css';

class ReadRecoveryPhrase extends Component {

  constructor(props) {
    super(props);

    let recoveryPhraseWords = this.props.wallet.activeWallet.recoveryPhrase.split(' ');
    let words = [];
    for (let i = 0; i < RECOVERY_PHRASE_LENGTH; ++i) {
      words.push({id: i, value: recoveryPhraseWords[i] || ''});
    }
    this.state = {
      words: words,
    };
  }

  render = () =>
    <div>
      <h1 className={style.Header}>RECOVERY PHRASE</h1>
      <p className={style.Description}>The phrase is case sensitive. Please make sure your write it down. You will need
        it to restore your
        wallet.</p>
      <div className={style.RecoveryPhrasePanel}>
        {this.state.words.map(el => <div key={el.id} className={style.RecoveryPhraseWordWrapper}>
          <span>{el.id + 1}. </span>
          <input
            className={style.RecoveryPhraseWord}
            disabled={true}
            value={el.value}/>
        </div>)}
      </div>
      <div className={style.ButtonPanel}>
        <div className={style.ButtonWrapper} onClick={() => {
          const {onNext} = this.props;
          if (typeof onNext === 'function') {
            onNext();
          }
        }}>
          <button>Yes, I have written it down</button>
        </div>
      </div>
    </div>;
}

export default connect(state => ({
  wallet: state.wallet
}))(ReadRecoveryPhrase);
