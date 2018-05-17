import React, {Component} from 'react';
import './Settings.css';

import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';
import {navToRestore} from "../actions/navigation";
import {setPassword} from "../actions/settings";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canRestoreWallet: false,
      password: '',
      confirmPassword: '',
      canSetPassword: false,
    };

    this.handleRestoreWalletCheck = this.handleRestoreWalletCheck.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleRestoreWalletCheck(event) {
    this.setState({canRestoreWallet: event.target.checked});
  }

  handlePasswordChange(event) {
    this.setState({[event.target.name]: event.target.value});
    if (event.target.name === 'password') {
      this.checkPassword(event.target.value, this.state.confirmPassword);
    } else {
      this.checkPassword(this.state.password, event.target.value);
    }
  }

  checkPassword(password, confirmPassword) {
    this.setState({canSetPassword: passwordRegex.test(password) && password === confirmPassword});
  }

  render() {
    return (
      <div className="SettingsWrapper">
        <h1>Settings</h1>
        <hr/>
        <div className="Settings">
          <div className="Setting PasswordSetting">
            <div>
              <h2>Set Wallet Password</h2>
              <div className="PasswordInputs">
                <div>
                  <p>Wallet password</p>
                  <input type="password" placeholder="Password" name="password" onChange={this.handlePasswordChange}/>
                </div>
                <div>
                  <p>Repeat password</p>
                  <input type="password" placeholder="Password" name="confirmPassword"
                         onChange={this.handlePasswordChange}/>
                </div>
              </div>
              <p>Please use a password at least 8 characters long, with at least one uppercase, one lowercase letter and
                one
                number.</p>
            </div>
            <div className="ButtonWrapper">
              <button disabled={!this.state.canSetPassword} onClick={this.props.setPassword}>Set&nbsp;password</button>
            </div>
          </div>

          <div className="Setting Rows">
            <h2>Write down Wallet Recovery Phrase</h2>
            <p>The wallet and tokens are held securely on this device only and not on any servers. If this application
              is
              moved to another device or is deleted, my wallet can be only recovered with a backup phrase. On the
              following screen, you will see a 24-word phrase. This is your wallet backup phrase. It can be entered in
              any
              version of Emotiq Wallet in order to restore your wallet.</p>
            <div className="ButtonWrapper">
              <button>Continue</button>
            </div>
          </div>

          <div className="Setting Rows">
            <h2>Restore Wallet</h2>
            <p>Restoring a wallet will delete your current wallet from this device and replace it with a restored one.
              In
              order to restore a wallet, on the next screen, you will be asked to enter 24-word recovery phrase.</p>
            <div>
              <input type="checkbox" onChange={this.handleRestoreWalletCheck}/>
              <span>I understand that restoring a wallet will delete my current wallet from this device</span>
            </div>
            <div className="ButtonWrapper">
              <button disabled={!this.state.canRestoreWallet} onClick={this.props.restore}>Continue</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  settings: state.settings
}), dispatch => ({
  back: () => dispatch(goBack()),
  restore: () => dispatch(navToRestore()),
  setPassword: () => dispatch(setPassword())
}))(Settings);
