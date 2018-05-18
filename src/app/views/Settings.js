import React, {Component} from 'react';
import './Settings.css';

import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';
import {navToRestore} from "../actions/navigation";

class Settings extends Component {
  render() {
    return (
      <div className="Settings">
        <a href="#" onClick={this.props.restore}>Restore wallet</a>
        <br/>
        <a href="#" onClick={this.props.back}>back</a>
      </div>
    );
  }
}

export default connect(null, dispatch => ({
  back: () => dispatch(goBack()),
  restore: () => dispatch(navToRestore())
}))(Settings);
