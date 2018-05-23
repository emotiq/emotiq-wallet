import React, {Component} from 'react';
import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';
import cx from 'classnames';

import {navToRestore} from '../actions/navigation';
import {changePassword, setPassword, writeDownRecoveryPhrase} from "../actions/wallet";

import style from './Settings.css';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canRestoreWallet: false,
      password: '',
      confirmPassword: '',
      oldPassword: '',
      canSetPassword: false,
    };

    this.handleSetPasswordChange = this.handleSetPasswordChange.bind(this);
    this.handleChangePasswordChange = this.handleChangePasswordChange.bind(this);
  }

  handleSetPasswordChange(event) {
    this.setState({[event.target.name]: event.target.value});
    if (event.target.name === 'password') {
      this.checkPassword(event.target.value, this.state.confirmPassword);
    } else {
      this.checkPassword(this.state.password, event.target.value);
    }
  }

  handleChangePasswordChange(event) {
    this.setState({[event.target.name]: event.target.value});
    if (event.target.name === 'password') {
      this.checkPassword(event.target.value, this.state.confirmPassword, this.state.oldPassword);
    } else if (event.target.name === 'confirmPassword') {
      this.checkPassword(this.state.password, event.target.value, this.state.oldPassword);
    } else {
      this.checkPassword(this.state.password, this.state.confirmPassword, event.target.value);
    }
  }

  checkPassword(password, confirmPassword, oldPassword) {
    this.setState({
      canSetPassword: passwordRegex.test(password) && password === confirmPassword &&
      (oldPassword === undefined || oldPassword.length > 0)
    });
  }

  render() {
    return (
      <div className={style.SettingsWrapper}>
        <h1>Settings</h1>
        <hr/>
        <div className={style.Settings}>
          {!!this.props.wallet.activeWallet && this.props.wallet.activeWallet.password === '' && (
            <div className={cx(style.Setting, style.Columns)}>
              <div>
                <h2>Set Wallet Password
                  <div className={style.Attention}/>
                </h2>
                <div className={style.PasswordInputs}>
                  <div>
                    <p>Wallet password</p>
                    <input type="password" placeholder="Password" name="password"
                           onChange={this.handleSetPasswordChange}/>
                  </div>
                  <div>
                    <p>Repeat password</p>
                    <input type="password" placeholder="Password" name="confirmPassword"
                           onChange={this.handleSetPasswordChange}/>
                  </div>
                </div>
                <p>Please use a password at least 8 characters long, with at least one uppercase, one lowercase letter
                  and
                  one
                  number.</p>
              </div>
              <div className={style.ButtonWrapper}>
                <button className={style.RightBottomButton} disabled={!this.state.canSetPassword}
                        onClick={() => {
                          this.props.setPassword(this.state.password)
                        }}>Set&nbsp;password
                </button>
              </div>
            </div>)}

          {!!this.props.wallet.activeWallet && !this.props.wallet.activeWallet.isRecoveryPhraseWrittenDown && (
            <div className={cx(style.Setting, style.Rows)}>
              <h2>Write down Wallet Recovery Phrase
                <div className={style.Attention}/>
              </h2>
              <p>The wallet and tokens are held securely on this device only and not on any servers. If this application
                is
                moved to another device or is deleted, my wallet can be only recovered with a backup phrase. On the
                following screen, you will see a 24-word phrase. This is your wallet backup phrase. It can be entered in
                any
                version of Emotiq Wallet in order to restore your wallet.</p>
              <div className={style.ButtonWrapper}>
                <button className={style.RightBottomButton} onClick={this.props.writeDownRecoveryPhrase}>Continue
                </button>
              </div>
            </div>)}

          {!!this.props.wallet.activeWallet && this.props.wallet.activeWallet.password !== '' && (
            <div className={cx(style.Setting, style.Rows)}>
              <h2>Change Wallet Password</h2>
              <div className={style.PasswordInputs}>
                <div>
                  <p>Current password</p>
                  <input name="oldPassword" type="password" onChange={this.handleChangePasswordChange}/>
                </div>
                <div>
                  <p>Wallet password</p>
                  <input name="password" type="password" onChange={this.handleChangePasswordChange}/>
                </div>
                <div>
                  <p>Repeat password</p>
                  <input name="confirmPassword" type="password" onChange={this.handleChangePasswordChange}/>
                </div>
              </div>
              <div>
                <p>Please use a password at least 8 characters long, with at least one uppercase, one lowercase letter
                  and
                  one number.</p>
                <div className={style.ButtonWrapper}>
                  <button className={style.RightBottomButton}
                          onClick={() => {
                            this.props.changePassword(this.state.oldPassword, this.state.password)
                          }}
                          disabled={!this.state.canSetPassword}>Change&nbsp;password
                  </button>
                </div>
              </div>
            </div>)}

          <div className={cx(style.Setting, style.Rows)}>
            <h2>Restore Wallet</h2>
            <p>Restoring a wallet will delete your current wallet from this device and replace it with a restored one.
              In
              order to restore a wallet, on the next screen, you will be asked to enter 24-word recovery phrase.</p>
            <div>
              <input type="checkbox" onChange={(e) => {
                this.setState({canRestoreWallet: e.target.checked})
              }}/>
              <span>I understand that restoring a wallet will delete my current wallet from this device</span>
            </div>
            <div className={style.ButtonWrapper}>
              <button className={style.RightBottomButton} disabled={!this.state.canRestoreWallet}
                      onClick={this.props.restore}>Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  wallet: state.wallet
}), dispatch => ({
  back: () => dispatch(goBack()),
  restore: () => dispatch(navToRestore()),
  setPassword: (pass) => dispatch(setPassword(pass)),
  changePassword: (oldPass, newPass) => {
    dispatch(changePassword(oldPass, newPass))
      .then(() => alert("Password was changed"))
      .catch((mes) => alert(mes))
  },
  writeDownRecoveryPhrase: () => dispatch(writeDownRecoveryPhrase())
}))(Settings);
