import React, {Component} from 'react';
import './Menu.css';

let image = require("../img/button.png");
console.log(image);

class StartScreen extends Component {
  render() {
    return (
      <div className="StartScreen">
        <span>My wallet</span>
      </div>
    );
  }
}

export default StartScreen;
