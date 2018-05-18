import React, {Component} from 'react';
import {connect} from "react-redux";
import {navToHelp, navToHome, navToNode, navToSettings} from '../actions/navigation';
import 'font-awesome/css/font-awesome.min.css';
import './Menu.css'

class Menu extends Component {
  render() {
    return (
      <div className="Menu">
        <MenuItem name="Home" icon="fa fa-home fa-3x" onClick={this.props.home}/>
        <MenuItem name="Node" icon="fa fa-sitemap fa-3x" onClick={this.props.node}/>
        <MenuItem name="Settings" icon="fa fa-cog fa-3x" onClick={this.props.settings}/>
        <MenuItem name="Help" icon="fa fa-question-circle-o fa-3x" onClick={this.props.help}/>
      </div>
    );
  }
}

class MenuItem extends Component {
  render() {
    return (
      <div className="MenuItem">
        <a href="#" onClick={this.props.onClick}>
          <figure>
            <i className={this.props.icon}/>
            <figcaption>
              {this.props.name}
            </figcaption>
          </figure>
        </a>
      </div>
    )
  }
}

export default connect(null, dispatch => ({
  home: () => dispatch(navToHome()),
  node: () => dispatch(navToNode()),
  settings: () => dispatch(navToSettings()),
  help: () => dispatch(navToHelp()),
}))(Menu);