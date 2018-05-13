import React, {Component} from 'react';
import './StartScreen.css';

import {connect} from 'react-redux';
import {navToCreate} from '../actions/navigation';

class StartScreen extends Component {
  render() {
    return (
      <div className="StartScreen">
        <h1>Emotiq Wallet!</h1>
        <br/>
        <a href="#" onClick={this.props.create}>Create</a>
      </div>
    );
  }
}

export default connect(null, dispatch=>({
  create: () => dispatch(navToCreate())
}))(StartScreen);
