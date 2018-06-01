import React, {Component} from 'react';
import style from './Help.css';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class Help extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      subject: '',
      problem: '',
      attachLogs: false,
      canSend: false,
    };
  }

  _send = () => {
    console.log(this.state);
  };

  _validate = () => this.setState({canSend: this.state.problem.length > 0 && EMAIL_REGEX.test(this.state.email) && this.state.subject.length > 0});

  render = () => (
    <div className={style.Help}>
      <div className={style.Caption}>
        <h1>Support Request</h1>
      </div>
      <div className={style.FormWrapper}>
        <div className={style.Form}>
          <p>Your e-mail</p>
          <input type='text' placeholder='Enter your e-mail, so we can reply to you' value={this.state.email}
                 onChange={(e) => this.setState({email: e.target.value}, this._validate)}/>
          <p>Subject</p>
          <input type='text' placeholder='Enter subject of your problem' value={this.state.subject}
                 onChange={(e) => this.setState({subject: e.target.value}, this._validate)}/>
          <p>Problem</p>
          <textarea placeholder='Describe your problem and steps to reproduce it' rows='7' value={this.state.problem}
                    onChange={(e) => this.setState({problem: e.target.value}, this._validate)}/>
          <p>Attach logs</p>
          <div className={style.ToggleWrapper}>
            <span>Logs will help us to find out the root cause of your problem</span>
            <label className={style.switch}>
              <input type="checkbox" value={this.state.attachLogs}
                     onChange={(e) => this.setState({attachLogs: e.target.checked})}/>
              <span className={style.slider}/>
            </label>
          </div>
          <div className={style.ButtonPanel}>
            <div className={style.ButtonWrapper}>
              <button onClick={this._send} disabled={!this.state.canSend}>Send request</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}