import React, {Component} from 'react';
import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';
import cx from 'classnames';

import {changePassword, setPassword, writeDownRecoveryPhrase} from '../actions/wallet';

import RestoreWallet from './recovery-phrase/RestoreWallet';
import ReadRecoveryPhrase from './recovery-phrase/ReadRecoveryPhrase';
import CheckRecoveryPhrase from './recovery-phrase/CheckRecoveryPhrase';

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
      readRecoveryPhraseModalIsOpen: false,
      checkRecoveryPhraseModalIsOpen: false,
      restoreWalletModalIsOpen: false,
    };
  }

  _handleSetPasswordChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
    if (event.target.name === 'password') {
      this._checkPassword(event.target.value);
    }
  };

  _handleChangePasswordChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
    if (event.target.name === 'password') {
      this._checkPassword(event.target.value, this.state.oldPassword);
    } else if (event.target.name === 'oldPassword') {
      this._checkPassword(this.state.password, event.target.value);
    }
  };

  _checkPassword = (password, oldPassword) => {
    this.setState({
      canSetPassword: passwordRegex.test(password) &&
      (oldPassword === undefined || oldPassword.length > 0)
    });
  };

  render = () => {
    const {restoreWalletModalIsOpen, readRecoveryPhraseModalIsOpen, checkRecoveryPhraseModalIsOpen} = this.state;
    const {activeWallet} = this.props.wallet;

    return (
      <div className={cx(style.SettingsWrapper, {
        [style.OverflowScroll]: !restoreWalletModalIsOpen && !readRecoveryPhraseModalIsOpen && !checkRecoveryPhraseModalIsOpen,
        [style.OverflowHidden]: restoreWalletModalIsOpen || readRecoveryPhraseModalIsOpen || checkRecoveryPhraseModalIsOpen,
      })}>
        <div className={style.Caption}>
          <h1>Settings</h1>
        </div>
        <div className={style.Settings}>
          {!!activeWallet && [activeWallet.password === '' && this._renderSetPassword(),
            !activeWallet.isRecoveryPhraseWrittenDown && [this._renderWriteDownRecoveryPhrase(),
              readRecoveryPhraseModalIsOpen && this._renderModalReadRecoveryPhrase(),
              checkRecoveryPhraseModalIsOpen && this._renderModalCheckRecoveryPhrase()],
            activeWallet.password !== '' && this._renderChangePassword()]}

          {this._renderRestoreWallet()}

          {restoreWalletModalIsOpen && this._renderModalRestoreWallet()}
        </div>
      </div>
    );
  };

  _renderSetPassword = () =>
    <div key='setPassword' className={cx(style.Setting, style.Columns)}>
      <div>
        <h2>Set Wallet Password
          <div className={style.Attention}/>
        </h2>
        <div className={style.PasswordInputs}>
          <div>
            <p>Wallet password</p>
            <input type="password" placeholder="Password" name="password"
                   onChange={this._handleSetPasswordChange}/>
          </div>
          <div>
            <p>Repeat password</p>
            <input type="password" placeholder="Password" name="confirmPassword"
                   onChange={this._handleSetPasswordChange}/>
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
                  this.setState({canSetPassword: false});
                  this.props.setPassword(this.state.password, this.state.confirmPassword);
                }}>Set&nbsp;password
        </button>
      </div>
    </div>;

  _renderWriteDownRecoveryPhrase = () =>
    <div key='writeRownRecoveryPhrase' className={cx(style.Setting, style.Rows)}>
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
        <button className={style.RightBottomButton}
                onClick={() => this.setState({readRecoveryPhraseModalIsOpen: true})}>Continue
        </button>
      </div>
    </div>;

  _renderChangePassword = () =>
    <div key='changePassword' className={cx(style.Setting, style.Rows)}>
      <h2>Change Wallet Password</h2>
      <div className={style.PasswordInputs}>
        <div>
          <p>Current password</p>
          <input name="oldPassword" type="password" onChange={this._handleChangePasswordChange}/>
        </div>
        <div>
          <p>Wallet password</p>
          <input name="password" type="password" onChange={this._handleChangePasswordChange}/>
        </div>
        <div>
          <p>Repeat password</p>
          <input name="confirmPassword" type="password" onChange={this._handleChangePasswordChange}/>
        </div>
      </div>
      <div>
        <p>Please use a password at least 8 characters long, with at least one uppercase, one lowercase letter
          and
          one number.</p>
        <div className={style.ButtonWrapper}>
          <button className={style.RightBottomButton}
                  onClick={() => {
                    this.props.changePassword(this.state.oldPassword, this.state.password, this.state.confirmPassword);
                  }}
                  disabled={!this.state.canSetPassword}>Change&nbsp;password
          </button>
        </div>
      </div>
    </div>;

  _renderRestoreWallet = () =>
    <div className={cx(style.Setting, style.Rows)}>
      <h2>Restore Wallet</h2>
      <p>Restoring a wallet will delete your current wallet from this device and replace it with a restored one.
        In
        order to restore a wallet, on the next screen, you will be asked to enter 24-word recovery phrase.</p>
      <div>
        <input type="checkbox" onChange={(e) => {
          this.setState({canRestoreWallet: e.target.checked});
        }}/>
        <span>I understand that restoring a wallet will delete my current wallet from this device</span>
      </div>
      <div className={style.ButtonWrapper}>
        <button className={style.RightBottomButton} disabled={!this.state.canRestoreWallet}
                onClick={() => {
                  this.setState({restoreWalletModalIsOpen: true});
                }}>Continue
        </button>
      </div>
    </div>;

  _renderModalReadRecoveryPhrase = () =>
    <div className={style.Modal} key='readRecoveryPhrase'
         onClick={() => this.setState({readRecoveryPhraseModalIsOpen: false})}>
      <div className={style.ModalContent} onClick={(event) => {
        event.stopPropagation();
      }}>
        <ReadRecoveryPhrase onNext={() => {
          this.setState({readRecoveryPhraseModalIsOpen: false, checkRecoveryPhraseModalIsOpen: true});
        }}/>
      </div>
    </div>;

  _renderModalCheckRecoveryPhrase = () =>
    <div className={style.Modal} key='checkRecoveryPhrase'
         onClick={() => this.setState({checkRecoveryPhraseModalIsOpen: false})}>
      <div className={style.ModalContent} onClick={(event) => {
        event.stopPropagation();
      }}>
        <CheckRecoveryPhrase
          onBack={() => {
            this.setState({checkRecoveryPhraseModalIsOpen: false, readRecoveryPhraseModalIsOpen: true});
          }}
          onNext={(phrase) => this.props.writeDownRecoveryPhrase(phrase)}
        />
      </div>
    </div>;

  _renderModalRestoreWallet = () =>
    <div className={style.Modal} onClick={() => this.setState({restoreWalletModalIsOpen: false})}>
      <div className={style.ModalContent} onClick={(event) => {
        event.stopPropagation();
      }}>
        <RestoreWallet onCancel={() => {
          this.setState({restoreWalletModalIsOpen: false});
        }}/>
      </div>
    </div>;
}

export default connect(state => ({
  wallet: state.wallet
}), dispatch => ({
  back: () => dispatch(goBack()),
  setPassword: (pass, confirmPass) => dispatch(setPassword(pass, confirmPass))
    .catch((mes) => alert(mes)),
  changePassword: (oldPass, newPass, confirmPass) =>
    dispatch(changePassword(oldPass, newPass, confirmPass))
      .then(() => alert('Password was changed'))
      .catch((mes) => alert(mes)),
  writeDownRecoveryPhrase: (phrase) => dispatch(writeDownRecoveryPhrase(phrase))
    .catch((mes) => alert(mes))
}))(Settings);
