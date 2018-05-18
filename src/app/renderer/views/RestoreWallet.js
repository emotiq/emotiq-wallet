import React, {Component} from 'react';

import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';

import {Mention, MentionsInput} from 'react-mentions'

import style from './RestoreWallet.css';

class RestoreWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [{id: 1, display: 'asd'},
        {id: 2, display: 'aer'}],
    };
  }

  render() {
    return (
      <div className={style.RestoreWallet}>
        <div className={style.Caption}>
          <h1>RESTORE WALLET</h1>
        </div>
        <div>
          <p>Wallet name</p>
          <input/>
        </div>
        <div className={style.RecoveryPhrase}>
          <p>Recovery phrase</p>
          <MentionsInput value={this.state.value} onChange={this.handleChange}>
            <Mention
              trigger=""
              data={this.state.words}
            />
          </MentionsInput>
        </div>

        <a href="#" onClick={this.props.back}>back</a>
      </div>
    );
  }
}

export default connect(null, dispatch => ({
  back: () => dispatch(goBack()),
}))(RestoreWallet);
