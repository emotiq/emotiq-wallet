import React, {Component} from 'react';
import style from  './Node.css';

class Node extends Component {
  render() {
    return (
      <div className={style.Node}>
        <span>Node</span>
      </div>
    );
  }
}

export default Node;
