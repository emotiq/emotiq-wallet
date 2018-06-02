import React, {Component} from 'react';
import {connect} from 'react-redux';

import style from './Syncing.css';
import {STATUS} from '../../shared/constants/bootstrap';
import {syncNode} from '../../shared/actions/bootstrap';

class Terms extends Component {

  constructor(props) {
    super(props);
    this.props.sync();
  }

  render = () => {
    const {status, currentBlock, blocks} = this.props.bootstrap;
    return (
      <div className={style.Main}>
        <div className={style.Container}>
          <img src={'../images/logo.png'} className={style.Logo}/>
          <span className={style.StatusBar}>
              {status === STATUS.STARTING ?
                'Node is starting ...' :
                'Syncing block ' + currentBlock + ' of ' + blocks + ' (' + Math.floor(currentBlock * 100 / blocks).toFixed() + '%)'}
              </span>
        </div>
      </div>
    );
  };
}

export default connect(state => ({
  bootstrap: state.bootstrap,
}), dispatch => ({
  sync: () => dispatch(syncNode()),
}))(Terms);