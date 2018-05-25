import React, {Component} from 'react';
import {connect} from 'react-redux';

import {RECOVERY_PHRASE_LENGTH} from '../../constants/config';

import style from './RecoveryPhrase.css';

const WORD_ID_PREFIX = 'word';

class CheckRecoveryPhrase extends Component {

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

  render = () =>
    <div>
      <h1 className={style.Header}>RECOVERY PHRASE</h1>
      <p className={style.Description}>Please fill all words from the recovery phrase in correct order</p>
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
        <div className={style.ButtonWrapper} onClick={() => {
          const {onBack} = this.props;
          if (typeof onBack === 'function') {
            onBack();
          }
        }}>
          <button>Back</button>
        </div>
        <div className={style.ButtonWrapper} onClick={() => {
          const {onNext} = this.props;
          if (typeof onNext === 'function') {
            onNext(this.state.words.map(w => w.value).join(' '));
          }
        }}>
          <button>Done</button>
        </div>
      </div>
    </div>;
}

export default connect(state => ({
  wallet: state.wallet
}))(CheckRecoveryPhrase);
