import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navToHelp, navToHome, navToNode, navToSettings} from '../actions/navigation';

import FAIcon from '@fortawesome/react-fontawesome';
import {faCog, faHome, faQuestionCircle, faSitemap} from '@fortawesome/fontawesome-free-solid'

import style from './Menu.css';

class Menu extends Component {

  render() {
    return (
      <div className={style.Menu}>
        <MenuItem name="Home" icon={faHome} onClick={this.props.home}/>
        <MenuItem name="Node" icon={faSitemap} onClick={this.props.node}/>
        <MenuItem name="Settings" icon={faCog}
                  notificationsCount={!!this.props.wallet.activeWallet && (!this.props.wallet.activeWallet.isPasswordSet + !this.props.wallet.activeWallet.isRecoveryPhraseWrittenDown)}
                  onClick={this.props.settings}/>
        <MenuItem name="Help" icon={faQuestionCircle} onClick={this.props.help}/>
      </div>
    );
  }
}

class MenuItem extends Component {
  render() {
    return (
      <div className={style.MenuItem}>
        {this.props.notificationsCount > 0 && (
          <div className={style.Notification}>
            {this.props.notificationsCount}
          </div>)}
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
  wallet: state.wallet,
}), dispatch => ({
  home: () => dispatch(navToHome()),
  node: () => dispatch(navToNode()),
  settings: () => dispatch(navToSettings()),
  help: () => dispatch(navToHelp()),
}))(Menu);