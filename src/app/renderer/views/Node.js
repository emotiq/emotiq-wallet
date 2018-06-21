import React, {Component} from 'react';
import style from './Node.css';

export default class Node extends Component {
  render = () =>
    <div className={style.Node}>
      <span>Node</span>
    </div>;
}