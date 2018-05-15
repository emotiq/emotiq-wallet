import React, {Component} from 'react';
import {connect} from "react-redux";
import {navToSettings} from '../actions/navigation';

const image = require("../img/button.png");

class Menu extends Component {
  render() {
    return (
      <div className="Menu">
        <MenuItem name="Wallet" image={image}/>
        <MenuItem name="Monitor" image={image}/>
        <MenuItem name="Settings" image={image} onClick={this.props.settings}/>
        <MenuItem name="Support" image={image}/>
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
            <img src={this.props.image}/>
            <figcaption>
              {this.props.name}
            </figcaption>
          </figure>
        </a>
      </div>
    )
  }
}

// export default Menu;

export default connect(null, dispatch => ({
  settings: () => dispatch(navToSettings())
}))(Menu);