import React, {Component} from 'react';
import {connect} from 'react-redux';
import {clipboard} from 'electron';
import FAIcon from '@fortawesome/react-fontawesome';
import {
  faBars,
  faChartBar,
  faChartLine,
  faDatabase,
  faEllipsisH,
  faReply,
  faShareAlt,
  faTh
} from '@fortawesome/fontawesome-free-solid';
import {faCircle} from '@fortawesome/fontawesome-free-regular';

import style from './Node.css';
import {EMTQ_DIVISIBILITY, POWER_DIVISIBILITY} from '../../shared/constants/config';
import {stake, unstake} from '../actions/node';

class Node extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'status',
      stakeAmount: 0,
      canStake: false,
      unstakeAmount: 0,
      canUnstake: false,
      confirmStakeModalIsOpen: false,
      confirmUnstakeModalIsOpen: false,
    };
  }

  render = () => {
    const {node} = this.props;
    const {activeTab} = this.state;
    return (
      <div>
        <div className={style.MainContainer}>
          <div className={style.Header}>
            <h1>{node.name}</h1>
            <p className={style.Address}>{node.address}</p>
          </div>
          <div className={style.TabsMenu}>
            <div className={activeTab === 'status' ? style.Active : ''}
                 onClick={() => this.setState({activeTab: 'status'})}>
              <FAIcon icon={faChartBar}/>
              <span> Status</span>
            </div>
            <div className={activeTab === 'stake' ? style.Active : ''}
                 onClick={() => this.setState({activeTab: 'stake'})}>
              <FAIcon icon={faReply} className={style.UpArrow}/>
              <span> Stake</span>
            </div>
            <div className={activeTab === 'unstake' ? style.Active : ''}
                 onClick={() => this.setState({activeTab: 'unstake'})}>
              <FAIcon icon={faReply} className={style.DownArrow}/>
              <span> UnStake</span>
            </div>
          </div>
          <div className={style.Content}>
            {(activeTab === 'status') && (
              <div>
                {this._renderStatus()}
              </div>
            )}
            {(activeTab === 'stake') && this._renderStake()}
            {this.state.confirmStakeModalIsOpen && this._renderStakeModal()}
            {(activeTab === 'unstake') && this._renderUnstake()}
            {this.state.confirmUnstakeModalIsOpen && this._renderUnstakeModal()}
          </div>
        </div>
      </div>
    );
  };

  _parseDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return date.getFullYear() + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (day < 10 ? '0' : '') + day + ' ' +
      (hours < 10 ? '0' : '') + hours + ':' +
      (minutes < 10 ? '0' : '') + minutes + ':' +
      (seconds < 10 ? '0' : '') + seconds;
  };

  _checkCanStake = () => {
    const {stakeAmount} = this.state;
    this.setState({canStake: stakeAmount > 0 && stakeAmount * POWER_DIVISIBILITY <= this.props.wallet.activeWallet.amount});
  };

  _checkCanUnstake = () => {
    const {unstakeAmount} = this.state;
    this.setState({canUnstake: unstakeAmount > 0 && unstakeAmount * POWER_DIVISIBILITY <= this.props.node.myFundsInEscrow});
  };

  _renderStatus = () => {
    const {node} = this.props;
    return (
      <div className={style.Cards}>
        <Card title='# of peers' icon={faShareAlt} text={node.numberOfPeers}/>
        <Card title='# of blocks' icon={faBars} text={node.numberOfBlocks}/>
        <Card title='# of transactions' icon={faTh} text={node.numberOfTransactions}/>
        <Card title='# of UTXOs' icon={faEllipsisH} text={node.numberOfUTXOs}/>
        <Card title='transaction rate(tps)' icon={faChartLine} text={node.transactionRate}/>
        <Card title='last timestamp' text={this._parseDate(node.lastTimestamp)}/>
        <Card title='My funds in escrow' icon={faCircle}
              text={(node.myFundsInEscrow / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)}/>
        <Card title='Total funds in escrow' icon={faDatabase}
              text={(node.fundsInEscrow / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)}/>
      </div>
    );
  };

  _renderStake = () => (
    <div className={style.Tab}>
      <h2>Stake (send EMTQ to escrow)</h2>
      <p>
        In order to participate in Emotiq Proof of Stake consensus protocol and collect transactions fees, a node should
        keep non zero amount of EMTQ in the escrow. More yuo keep in the escrow, more chances you have to win the leader
        lottery.
      </p>
      <h3>Amount</h3>
      <input type='number' min={0} step={Math.pow(0.1, EMTQ_DIVISIBILITY)} value={this.state.stakeAmount}
             onChange={(e) => this.setState({stakeAmount: e.target.value}, this._checkCanStake)}/>
      <div className={style.ButtonPanel}>
        <div className={style.ButtonWrapper}>
          <button className={style.Button} onClick={() => this.setState({confirmStakeModalIsOpen: true})}
                  disabled={!this.state.canStake}>Next
          </button>
        </div>
      </div>
    </div>
  );

  _renderUnstake = () => (
    <div className={style.Tab}>
      <h2>UnStake (withdraw EMTQ from escrow)</h2>
      <p>
        If the amount of your founds in escrow will become zero you will not be able to participate in the leader
        lottery and will not be able to collect transaction fees.
      </p>
      <h3>Amount</h3>
      <input type='number' min={0} step={Math.pow(0.1, EMTQ_DIVISIBILITY)} value={this.state.unstakeAmount}
             onChange={(e) => this.setState({unstakeAmount: e.target.value}, this._checkCanUnstake)}/>
      <div className={style.ButtonPanel}>
        <div className={style.ButtonWrapper}>
          <button className={style.Button} onClick={() => this.setState({confirmUnstakeModalIsOpen: true})}
                  disabled={!this.state.canUnstake}>Next
          </button>
        </div>
      </div>
    </div>
  );

  _renderStakeModal = () => {
    const {stakeAmount} = this.state;
    return (
      <div className={style.Modal} onClick={() => this.setState({confirmStakeModalIsOpen: false})}>
        <div className={style.ModalContent} onClick={(event) => event.stopPropagation()}>
          <h2>Confirm Stake Transaction</h2>
          <p>Amount</p>
          <p className={style.Red}>{stakeAmount} EMTQ</p>
          <p>Total funds in escrow after transaction</p>
          <p
            className={style.Red}>{(this.props.node.fundsInEscrow / POWER_DIVISIBILITY + (+stakeAmount)).toFixed(EMTQ_DIVISIBILITY)} EMTQ
          </p>
          <div className={style.ButtonPanel}>
            <div className={style.ButtonWrapper}>
              <button className={style.Button} onClick={() => this.setState({confirmStakeModalIsOpen: false})}>Cancel
              </button>
            </div>
            <div className={style.ButtonWrapper}>
              <button className={style.Button} onClick={this._stake}>Send</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  _renderUnstakeModal = () => {
    const {unstakeAmount} = this.state;
    return (
      <div className={style.Modal} onClick={() => this.setState({confirmUnstakeModalIsOpen: false})}>
        <div className={style.ModalContent} onClick={(event) => event.stopPropagation()}>
          <h2>Confirm UnStake Transaction</h2>
          <p>Amount</p>
          <p className={style.Red}>{unstakeAmount} EMTQ</p>
          <p>Total funds in escrow after transaction</p>
          <p
            className={style.Red}>{(this.props.node.fundsInEscrow / POWER_DIVISIBILITY - (+unstakeAmount)).toFixed(EMTQ_DIVISIBILITY)} EMTQ
          </p>
          <div className={style.ButtonPanel}>
            <div className={style.ButtonWrapper}>
              <button className={style.Button} onClick={() => this.setState({confirmUnstakeModalIsOpen: false})}>Cancel
              </button>
            </div>
            <div className={style.ButtonWrapper}>
              <button className={style.Button} onClick={this._unstake}>Withdraw</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  _stake = () => {
    this.props.stake(this.state.stakeAmount * POWER_DIVISIBILITY);
    this.setState({confirmStakeModalIsOpen: false, activeTab: 'status'});
  };

  _unstake = () => {
    this.props.unstake(this.state.unstakeAmount * POWER_DIVISIBILITY);
    this.setState({confirmUnstakeModalIsOpen: false, activeTab: 'status'});
  };
}

class Card extends Component {
  render = () => (
    <div className={style.Card}>
      <p>{this.props.title || ''}</p>
      <div>
        {!!this.props.icon && <FAIcon icon={this.props.icon} size='3x'/>}
        <span>{this.props.text}</span>
      </div>
    </div>
  );
}

export default connect(state => ({
  wallet: state.wallet,
  node: state.node,
}), dispatch => ({
  stake: (amount) => dispatch(stake(amount)),
  unstake: (amount) => dispatch(unstake(amount)),
}))(Node);