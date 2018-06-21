import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';

import {Route} from 'react-router';

import Menu from './Menu';

import Home from './Home';
import Node from './Node';
import Help from './Help';
import Settings from './Settings';
import {
  HELP_SCREEN_KEY,
  HOME_SCREEN_KEY,
  NODE_SCREEN_KEY,
  SETTINGS_SCREEN_KEY,
} from '../../shared/constants/navigation';
import Terms from './Terms';
import Syncing from './Syncing';
import {STATUS} from '../../shared/constants/bootstrap';

class Bootstrap extends Component {
  render = () => {
    const {bootstrap} = this.props;
    return (
      <div>
        {bootstrap.status === STATUS.SYNCED ?
          <div>
            <Menu/>
            <ConnectedRouter history={this.props.history}>
              <div>
                <Route exact path={HOME_SCREEN_KEY} component={Home}/>
                <Route path={NODE_SCREEN_KEY} component={Node}/>
                <Route path={SETTINGS_SCREEN_KEY} component={Settings}/>
                <Route path={HELP_SCREEN_KEY} component={Help}/>
              </div>
            </ConnectedRouter>
          </div> :
          bootstrap.status === STATUS.TERMS ?
            <Terms/> :
            <Syncing/>}
      </div>
    );
  };
}

export default connect(state => ({
  bootstrap: state.bootstrap,
}))(Bootstrap);