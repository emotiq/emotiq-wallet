import React, {Component} from 'react';
import {connect} from 'react-redux';
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
      passwordToChange: '',
      confirmPasswordToChange: '',
      canSetPassword: false,
      canChangePassword: false,
      readRecoveryPhraseModalIsOpen: false,
      checkRecoveryPhraseModalIsOpen: false,
      restoreWalletModalIsOpen: false,
    };
  }

  _handleSetPasswordChange = (event) => {
    this.setState({[event.target.name]: event.target.value}, this._checkPassword);
  };

  _handleChangePasswordChange = (event) => {
    this.setState({[event.target.name]: event.target.value}, this._checkChangePassword);
  };

  _checkPassword = () => this.setState({canSetPassword: passwordRegex.test(this.state.password)});

  _checkChangePassword = () => this.setState({canChangePassword: passwordRegex.test(this.state.passwordToChange) && this.state.oldPassword.length > 0});

  render = () => {
    const {restoreWalletModalIsOpen, readRecoveryPhraseModalIsOpen, checkRecoveryPhraseModalIsOpen} = this.state;
    const {activeWallet} = this.props.wallet;

    return (
      <div className={style.SettingsWrapper}>
        <div className={style.Caption}>
          <img src={'../images/logo-text.svg'} className={style.WalletHeaderLogo}/>
          <h1>Settings</h1>
        </div>
        <div className={style.Settings}>
          {!!activeWallet && [!activeWallet.password && this._renderSetPassword(),
            !activeWallet.isRecoveryPhraseWrittenDown && [this._renderWriteDownRecoveryPhrase(),
              readRecoveryPhraseModalIsOpen && this._renderModalReadRecoveryPhrase(),
              checkRecoveryPhraseModalIsOpen && this._renderModalCheckRecoveryPhrase()],
            !!activeWallet.password && this._renderChangePassword()]}

          {this._renderRestoreWallet()}

          {restoreWalletModalIsOpen && this._renderModalRestoreWallet()}
        </div>
      </div>
    );
  };

  _renderSetPassword = () =>
    <div key='setPassword' className={cx(style.Setting, style.Columns, style.ChangePassword)}>
      <div className={style.PasswordInputs}>
        <div className={style.PasswordInput}>
          <span className={style.Attention}>Wallet password</span>
          <input type="password" placeholder="Password" name="password"
                 onChange={this._handleSetPasswordChange}/>
        </div>
        <div className={style.PasswordInput}>
          <span>Repeat password</span>
          <input type="password" placeholder="Password" name="confirmPassword"
                 onChange={this._handleSetPasswordChange}/>
        </div>
      </div>
      <div className={style.PasswordButton}>
        <p className={style.PasswordLabel}>
          Please use a password at least 8 characters long,<br/>
          with at least one uppercase, one lowercase letter and one number.
        </p>
        <button className={style.Button} disabled={!this.state.canSetPassword}
                onClick={
                  () => this.props.setPassword(this.state.password, this.state.confirmPassword)
                }>
          <span>Set password</span>
          <img src={'../images/arrow-next.svg'}/>
        </button>
      </div>
    </div>;

  _renderWriteDownRecoveryPhrase = () =>
    <div key='writeRownRecoveryPhrase' className={cx(style.Setting, style.Rows, style.WriteDown)}>
      <h2>Write down Wallet Recovery Phrase</h2>
      <p>The wallet and tokens are held securely on this device only and not on any servers. If this application
        is
        moved to another device or is deleted, my wallet can be only recovered with a backup phrase. On the
        following screen, you will see a 24-word phrase. This is your wallet backup phrase. It can be entered in
        any
        version of Emotiq Wallet in order to restore your wallet.</p>
      <div className={style.ButtonWrapper}>
        <button className={style.Button}
                onClick={() => this.setState({readRecoveryPhraseModalIsOpen: true})}>
          <span>Continue</span>
          <img src={'../images/arrow-next.svg'}/>
        </button>
      </div>
    </div>;

  _renderChangePassword = () =>
    <div key='changePassword' className={cx(style.Setting, style.Rows)}>
      <h2>Change Wallet Password</h2>
      <div className={style.PasswordInputs}>
        <div className={style.ChangePasswordInput}>
          <span>Current password</span>
          <input name="oldPassword" type="password" onChange={this._handleChangePasswordChange}/>
        </div>
        <div className={style.ChangePasswordInput}>
          <span>Wallet password</span>
          <input name="passwordToChange" type="password" onChange={this._handleChangePasswordChange}/>
        </div>
        <div className={style.ChangePasswordInput}>
          <span>Repeat password</span>
          <input name="confirmPasswordToChange" type="password" onChange={this._handleChangePasswordChange}/>
        </div>
      </div>
      <div className={style.PasswordButton}>
        <p className={style.PasswordLabel}>Please use a password at least 8 characters long,<br/>
          with at least one uppercase, one lowercase letter and one number.</p>
        <div className={style.ButtonWrapper}>
          <button className={style.Button}
                  onClick={() => {
                    this.props.changePassword(this.state.oldPassword, this.state.passwordToChange, this.state.confirmPasswordToChange);
                  }}
                  disabled={!this.state.canChangePassword}>
            Change&nbsp;password
          </button>
        </div>
      </div>
    </div>;

  _renderRestoreWallet = () =>
    <div className={cx(style.Setting, style.Rows, style.RestoreWallet)}>
      <h2>Restore Wallet</h2>
      <p>Restoring a wallet will delete your current wallet from this device and replace it with a restored one.
        In
        order to restore a wallet, on the next screen, you will be asked to enter 24-word recovery phrase.</p>
      <div className={style.RestoreWalletCheckbox}>
        <div className={style.CheckboxContainer}>
          <input type="checkbox" onChange={(e) => this.setState({canRestoreWallet: e.target.checked})}
                 className={style.CheckboxInput}/>
          <div className={style.Checkbox}
               style={{background: this.state.canRestoreWallet ? 'rgba(0, 0, 0, 0.2) url("../images/check.svg") center center no-repeat' : ''}}/>
          <span>I understand that restoring a wallet will delete my current wallet from this device</span>
        </div>
      </div>
      <div className={style.ButtonWrapper}>
        <button className={style.Button} disabled={!this.state.canRestoreWallet}
                onClick={() => {
                  this.setState({restoreWalletModalIsOpen: true});
                }}>
          <span>Continue</span>
          <img src={'../images/arrow-next.svg'}/>
        </button>
      </div>
    </div>;

  _renderModalReadRecoveryPhrase = () =>
    <div className={style.Modal} key='readRecoveryPhrase'
         onClick={() => this.setState({readRecoveryPhraseModalIsOpen: false})}>
      <div className={style.ModalContent} style={{width: 790}}
           onClick={(event) => event.stopPropagation()}>
        <ReadRecoveryPhrase onNext={() => {
          this.setState({readRecoveryPhraseModalIsOpen: false, checkRecoveryPhraseModalIsOpen: true});
        }}/>
      </div>
    </div>;

  _renderModalCheckRecoveryPhrase = () =>
    <div className={style.Modal} key='checkRecoveryPhrase'
         onClick={() => this.setState({checkRecoveryPhraseModalIsOpen: false})}>
      <div className={style.ModalContent} style={{width: 790}}
           onClick={(event) => event.stopPropagation()}>
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
  setPassword: (pass, confirmPass) => dispatch(setPassword(pass, confirmPass))
    .catch((mes) => alert(mes)),
  changePassword: (oldPass, newPass, confirmPass) =>
    dispatch(changePassword(oldPass, newPass, confirmPass))
      .then(() => alert('Password was changed'))
      .catch((mes) => alert(mes)),
  writeDownRecoveryPhrase: (phrase) => dispatch(writeDownRecoveryPhrase(phrase))
    .catch((mes) => alert(mes))
}))(Settings);
