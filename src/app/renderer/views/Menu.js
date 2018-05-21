import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navToHelp, navToHome, navToNode, navToSettings} from '../actions/navigation';

import FAIcon from '@fortawesome/react-fontawesome';
import {faHome, faSitemap, faCog, faQuestionCircle} from '@fortawesome/fontawesome-free-solid'

import style from './Menu.css';

class Menu extends Component {

  render() {
    return (
      <div className={style.Menu}>
        <MenuItem name="Home" icon={faHome} onClick={this.props.home}/>
        <MenuItem name="Node" icon={faSitemap} onClick={this.props.node}/>
        <MenuItem name="Settings" icon={faCog} onClick={this.props.settings}/>
        <MenuItem name="Help" icon={faQuestionCircle} onClick={this.props.help}/>
      </div>
    );
  }
}

class MenuItem extends Component {
  render() {
    return (
      <div className={style.MenuItem}>
        <a href="#" onClick={this.props.onClick}>
          <figure>
            <FAIcon icon={this.props.icon} size='3x'/>
            <figcaption>
              {this.props.name}
            </figcaption>
          </figure>
        </a>
      </div>
    );
  }
}

export default connect(state => ({
  notifications: state.settings,
}), dispatch => ({
  home: () => dispatch(navToHome()),
  node: () => dispatch(navToNode()),
  settings: () => dispatch(navToSettings()),
  help: () => dispatch(navToHelp()),
}))(Menu);