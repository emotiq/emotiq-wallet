import React, {Component} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';
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

  _getTrimmedAddress = (address, leftPartlength = 10, rightPartLenght = 10) => {
    return address.substr(0, leftPartlength) + '...' + address.slice(-rightPartLenght);
  };


  render = () => {
    const {node} = this.props;
    const {activeTab} = this.state;
    return (
      <div>
        <div className={style.MainContainer}>
          <div className={style.Header}>
            <img src={'../images/logo-text.svg'}/>
            <h1>{node.name}</h1>
            <div className={style.PublicKeyContainer}>
              <span className={style.PublicKey}>Node publickey</span>
              <div className={style.Address}>{this._getTrimmedAddress(node.address, 20)}</div>
            </div>
          </div>
          <div className={style.Menu}>
            <div className={`${style.MenuTab} ${activeTab === 'status' ? style.Active : ''}`}
                 onClick={() => this.setState({activeTab: 'status'})}>
              <img src={'../images/transactions-ico.svg'} className={style.MenuTabIcon}/>
              <span>Status</span>
            </div>
            <div className={`${style.MenuTab} ${activeTab === 'stake' ? style.Active : ''}`}
                 onClick={() => this.setState({activeTab: 'stake'})}>
              <img src={'../images/send-ico.svg'} className={style.MenuTabIcon}/>
              <span>Stake</span>
              <img src={'../images/info.svg'}/>
            </div>
            <div className={`${style.MenuTab} ${activeTab === 'unstake' ? style.Active : ''}`}
                 onClick={() => this.setState({activeTab: 'unstake'})}>
              <img src={'../images/receive-ico.svg'} className={style.MenuTabIcon}/>
              <span>UnStake</span>
              <img src={'../images/info.svg'}/>
            </div>
          </div>
          <div className={style.Content}>
            {(activeTab === 'status') && (
              <div>
                {this._renderStatus()}
              </div>
            )}
            {(activeTab === 'stake') && (this.state.confirmStakeModalIsOpen ? this._renderStakeModal() : this._renderStake())}
            {(activeTab === 'unstake') && (this.state.confirmUnstakeModalIsOpen ? this._renderUnstakeModal() : this._renderUnstake())}
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
        <Card title='# of peers' text={node.numberOfPeers}
              style={{gridArea: 'peers', backgroundImage: 'url(../images/peers.svg)'}}/>
        <Card title='# of blocks' text={node.numberOfBlocks}
              style={{gridArea: 'blocks', backgroundImage: 'url(../images/blocks.svg)'}}/>
        <Card title='# of transactions' text={node.numberOfTransactions}
              style={{gridArea: 'transactions', backgroundImage: 'url(../images/transactions.svg)'}}/>
        <Card title='# of UTXOs' text={node.numberOfUTXOs}
              style={{gridArea: 'utxo', backgroundImage: 'url(../images/utxo.svg)'}}/>
        <Card title='transaction rate(tps)' text={node.transactionRate}
              style={{gridArea: 'rate', backgroundImage: 'url(../images/rate.svg)'}}/>
        <Card title='last timestamp' text={this._parseDate(node.lastTimestamp)} className={style.Timestamp}
              style={{gridArea: 'last', backgroundImage: 'url(../images/timestamp.svg)'}}/>
        <Card title='My funds in escrow' className={style.Funds}
              text={(node.myFundsInEscrow / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)}
              style={{gridArea: 'funds', backgroundImage: 'url(../images/wallet.svg)'}}/>
        <Card title='Total funds in escrow' className={style.Funds}
              text={(node.fundsInEscrow / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)}
              style={{gridArea: 'total', backgroundImage: 'url(../images/total.svg)'}}/>
      </div>
    );
  };

  _renderStake = () => (
    <div className={style.Tab}>
      <h2>Stake (send EMTQ to escrow)</h2>
      <div className={style.Paragraph}>
        <img src={'../images/!.svg'}/>
        <p>
          In order to participate in Emotiq Proof of Stake consensus protocol and collect transactions fees, a node
          should
          keep non zero amount of EMTQ in the escrow. More yuo keep in the escrow, more chances you have to win the
          leader
          lottery.
        </p>
      </div>
      <h3>Amount</h3>
      <div className={style.Input}>
        <input type='number' min={0} step={Math.pow(0.1, EMTQ_DIVISIBILITY)} value={this.state.stakeAmount}
               onChange={(e) => this.setState({stakeAmount: e.target.value}, this._checkCanStake)}/>
        {this.state.canStake ? <img src={'../images/check-green.svg'}/> : null}
      </div>
      <div className={style.ButtonPanel}>
        <div className={style.ButtonWrapper}>
          <button className={style.Button} onClick={() => this.setState({confirmStakeModalIsOpen: true})}
                  disabled={!this.state.canStake}>
            <span>Next</span>
            <img src={'../images/arrow-next.svg'}/>
          </button>
        </div>
      </div>
    </div>
  );

  _renderUnstake = () => (
    <div className={style.Tab}>
      <h2>UnStake (withdraw EMTQ from escrow)</h2>
      <div className={style.Paragraph}>
        <img src={'../images/!.svg'}/>
        <p>
          If the amount of your founds in escrow will become zero you will not be able to participate in the leader
          lottery and will not be able to collect transaction fees.
        </p>
      </div>
      <h3>Amount</h3>
      <div className={style.Input}>
        <input type='number' min={0} step={Math.pow(0.1, EMTQ_DIVISIBILITY)} value={this.state.unstakeAmount}
               onChange={(e) => this.setState({unstakeAmount: e.target.value}, this._checkCanUnstake)}/>
        {this.state.canUnstake ? <img src={'../images/check-green.svg'}/> : null}
      </div>
      <div className={style.ButtonPanel}>
        <div className={style.ButtonWrapper}>
          <button className={style.Button} onClick={() => this.setState({confirmUnstakeModalIsOpen: true})}
                  disabled={!this.state.canUnstake}>
            <span>Next</span>
            <img src={'../images/arrow-next.svg'}/>
          </button>
        </div>
      </div>
    </div>
  );

  _renderStakeModal = () => {
    const {stakeAmount} = this.state;
    return (
      <div className={style.Tab}>
        <h2>Confirm Stake Transaction</h2>
        <div className={style.UnstakeModal}>
          <div>
            <h3>Amount</h3>
            <span>{stakeAmount} EMTQ</span>
          </div>
          <div>
            <h3>Total funds in escrow after transaction</h3>
            <span className={style.Red}>
            {(this.props.node.fundsInEscrow / POWER_DIVISIBILITY + (+stakeAmount)).toFixed(EMTQ_DIVISIBILITY)} EMTQ
          </span>
          </div>
        </div>
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
    );
  };

  _renderUnstakeModal = () => {
    const {unstakeAmount} = this.state;
    return (
      <div className={style.Tab}>
        <h2>Confirm UnStake Transaction</h2>
        <div className={style.UnstakeModal}>
          <div>
            <h3>Amount</h3>
            <span>{unstakeAmount} EMTQ</span>
          </div>
          <div>
            <h3>Total funds in escrow after transaction</h3>
            <span className={style.Red}>
            {(this.props.node.fundsInEscrow / POWER_DIVISIBILITY - (+unstakeAmount)).toFixed(EMTQ_DIVISIBILITY)} EMTQ
          </span>
          </div>
        </div>


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
    <div className={cx(style.Card, this.props.className)} style={this.props.style}>
      <p>{this.props.title || ''}</p>
      <div>
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