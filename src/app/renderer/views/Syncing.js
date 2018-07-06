import React, {Component} from 'react';
import {connect} from 'react-redux';

import style from './Syncing.css';
import {STATUS} from '../../shared/constants/bootstrap';
import {syncNode} from '../actions/bootstrap';

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
          <img src={'../images/logo.svg'} className={style.Logo}/>
          <div className={style.StatusBar}>
                <span className={style.statusText}>
                  {status === STATUS.STARTING ? 'Node is starting ...' : 'Syncing block'}</span>

              {status === STATUS.SYNCING ?
                <div className={style.statusBar}>
                  <div className={style.statusBarProgress}
                       style={{transform: `scaleX(${(currentBlock / blocks)})`}}/>
                  <span className={style.statusText}>{`${currentBlock} of ${blocks}`}</span>
                </div>
                : null
              }
              </div>
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