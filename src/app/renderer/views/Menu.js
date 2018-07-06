import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navToHelp, navToHome, navToNode, navToSettings} from '../actions/navigation';

import style from './Menu.css';

class Menu extends Component {

  state = {
    currentTab: 'home',
  };

  render = () => {
    const {activeWallet} = this.props.wallet;
    return (
      <div className={style.Menu}>
        <img className={style.Logo} src={'../images/logo-icon.svg'} alt="emotiq logo"/>
        <MenuItem name="Home" icon={this.state.currentTab === 'home' ? '../images/home-h.svg' : '../images/home.svg'}
                  onClick={this._home}/>
        <MenuItem name="Node" icon={this.state.currentTab === 'node' ? '../images/node-h.svg' : '../images/node.svg'}
                  onClick={this._node}/>
        <MenuItem name="Settings"
                  icon={this.state.currentTab === 'settings' ? '../images/settings-h.svg' : '../images/settings.svg'}
                  notificationsCount={!!activeWallet && (!activeWallet.password + !activeWallet.isRecoveryPhraseWrittenDown)}
                  onClick={this._settings}/>
        <MenuItem name="Help" icon={'../images/help.svg'}
                  onClick={this._help}/>
      </div>
    );
  };

  _home = () => {
    this.props.home();
    this.setState({currentTab: 'home'});
  };

  _node = () => {
    this.props.node();
    this.setState({currentTab: 'node'});
  };

  _settings = () => {
    this.props.settings();
    this.setState({currentTab: 'settings'});
  };

  _help = () => {
    this.props.help();
    this.setState({currentTab: 'help'});
  }
}

class MenuItem extends Component {
  render = () =>
    <div className={style.MenuItem} onClick={this.props.onClick}>
      <figure>
        {this.props.notificationsCount > 0 && (
          <div className={style.Badge}>
            <span>{this.props.notificationsCount}</span>
          </div>)}
        {/*<FAIcon icon={this.props.icon} size='2x' color='#fff'/>*/}
        <img src={this.props.icon}/>
        <figcaption className={style.IcoLabel}>
          {this.props.name}
        </figcaption>
      </figure>
    </div>;
}

export default connect(state => ({
  wallet: state.wallet,
}), dispatch => ({
  home: () => dispatch(navToHome()),
  node: () => dispatch(navToNode()),
  settings: () => dispatch(navToSettings()),
  help: () => dispatch(navToHelp()),
}))(Menu);