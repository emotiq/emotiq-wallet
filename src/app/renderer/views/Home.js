import React, {Component} from 'react';
import {connect} from 'react-redux';
import {clipboard} from 'electron';
import {renameWallet, sendEMTQ} from '../actions/wallet';
import FAIcon from '@fortawesome/react-fontawesome';
import {faArrowAltCircleRight, faChartPie, faCopy, faPencilAlt, faReply} from '@fortawesome/fontawesome-free-solid';
import cx from 'classnames';
import QRCode from 'qrcode.react';
import _ from 'lodash';
import {EMTQ_DIVISIBILITY, FEE} from '../../shared/constants/config';

import style from './Home.css';

const POWER_DIVISIBILITY = Math.pow(10, EMTQ_DIVISIBILITY);

class Home extends Component {

  constructor(props) {
    super(props);

    let {activeWallet} = this.props.wallet;
    this.state = {
      walletName: activeWallet && activeWallet.name || '',
      editWalletName: false,
      activeTab: 'transactions',
      sendAddress: '',
      sendAmount: 0,
      isValidSend: false,
      confirmSendModalIsOpen: false,
      transactionModalIsOpen: false,
      selectedTransaction: null,
    };
  }

  _getGroupedOrderedTransactions = (transactions) => {
    if (!transactions) {
      return [];
    }
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    transactions = transactions.sort((a, b) => b.timestamp - a.timestamp);
    let grouped = _.groupBy(transactions, (t) => {
      let date = new Date();
      date.setTime(t.timestamp * 1000);
      return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate() ? 'Today' :
        date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate() ? 'Yesterday' :
          (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    });
    let groupedOrdered = [];
    Object.keys(grouped).sort((a, b) => grouped[b][0].timestamp - grouped[a][0].timestamp).forEach(key => groupedOrdered[key] = grouped[key]);
    return groupedOrdered;
  };

  _validateSendInfo = () => {
    this.setState({isValidSend: this.state.sendAmount > 0 && this._isEnoughMoneyForSend() && this.state.sendAddress.length > 0});
  };

  _isEnoughMoneyForSend = () => (+this.state.sendAmount + this._getFees()) <= this._getWalletAmount();

  _getWalletAmount = () => this.props.wallet.activeWallet.amount / POWER_DIVISIBILITY;

  _getFees = () => Math.ceil(this.state.sendAmount * POWER_DIVISIBILITY * FEE) / POWER_DIVISIBILITY;

  _getUnusedAddress = () => {
    const {activeWallet} = this.props.wallet;
    let unusedAddress = !!activeWallet && activeWallet.addresses.find(a => !a.used);
    return unusedAddress ? unusedAddress.address : '';
  };

  _sendEMTQ = () => {
    this.props.sendEMTQ(this.state.sendAddress, this.state.sendAmount * POWER_DIVISIBILITY)
      .then(() => {
        this.setState({confirmSendModalIsOpen: false, sendAddress: '', sendAmount: 0, isValidSend: false});
        alert('Transaction has been created');
      })
      .catch((mes) => alert(mes));
  };

  _onKeyPressWalletName = (e) => {
    if (e.key === 'Enter') {
      this._changeWalletName();
    } else if (e.key === 'Escape') {
      this.setState({editWalletName: false, walletName: this.props.wallet.activeWallet.name});
    }
  };

  _changeWalletName = () => {
    this.setState({editWalletName: false});
    this.props.renameWallet(this.state.walletName)
      .catch((mes) => alert(mes));
  };

  _getTransactionTime = (timestamp) => {
    let date = new Date();
    date.setTime(timestamp * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return (hours < 10 ? '0' : '') + hours + ':' +
      (minutes < 10 ? '0' : '') + minutes + ':' +
      (seconds < 10 ? '0' : '') + seconds;
  };

  _getTransactionDateTime = (timestamp) => {
    let date = new Date();
    date.setTime(timestamp * 1000);
    let day = date.getDate();
    let month = date.toLocaleString('en-us', {month: 'long'});
    return month + ' ' +
      (day < 10 ? '0' : '') + day + ', ' +
      date.getFullYear() + ' ' +
      this._getTransactionTime(timestamp * 1000);
  };

  _getTransactionAmount = (tran) => {
    return tran.inputs.reduce((a, c) => a + c.amount, 0);
  };

  render = () => {
    const {activeWallet} = this.props.wallet;
    const {activeTab, confirmSendModalIsOpen} = this.state;
    return (
      <div>
        {!!activeWallet ? (
            <div className={style.Home}>
              <div className={style.WalletHeader}>
                <input typeof={'text'} value={this.state.walletName} disabled={!this.state.editWalletName}
                       id={'walletName'}
                       onChange={(e) => this.setState({walletName: e.target.value})}
                       onKeyDown={this._onKeyPressWalletName}
                       onBlur={this._changeWalletName}/>
                <p>{(this._getWalletAmount()).toFixed(EMTQ_DIVISIBILITY)} EMTQ</p>
                <div className={style.Rename} onClick={() => {
                  this.setState({editWalletName: true});
                  let header = document.getElementById('walletName');
                  setTimeout(() => header.focus(), 0);
                }}>
                  <FAIcon icon={faPencilAlt}/>
                  <span>Rename</span>
                </div>
              </div>
              <div className={style.WalletMenu}>
                <div className={activeTab === 'transactions' ? style.Active : ''}
                     onClick={() => this.setState({activeTab: 'transactions'})}>
                  <FAIcon icon={faChartPie}/>
                  <span>Transactions</span>
                </div>
                <div className={activeTab === 'send' ? style.Active : ''}
                     onClick={() => this.setState({activeTab: 'send'})}>
                  <FAIcon icon={faReply} className={style.UpArrow}/>
                  <span>Send</span>
                </div>
                <div className={activeTab === 'receive' ? style.Active : ''}
                     onClick={() => this.setState({activeTab: 'receive'})}>
                  <FAIcon icon={faReply} className={style.DownArrow}/>
                  <span>Receive</span>
                </div>
              </div>
              <div className={style.WalletFunctionalArea}>
                {(activeTab === 'transactions') && (
                  <div>
                    {this._renderTransactions()}
                    {!!this.state.selectedTransaction && this._renderTransactionModal()}
                  </div>
                )}
                {(activeTab === 'send') && (
                  <div>
                    {this._renderSend()}
                    {confirmSendModalIsOpen && this._renderConfirmSend()}
                  </div>
                )}
                {(activeTab === 'receive') && (
                  <div>
                    {this._renderReceive()}
                  </div>
                )}
              </div>
            </div>) :

          <h1 className={style.NoWalletHeader}>No existing wallet, please restore wallet</h1>
        }
      </div>
    );
  };

  _renderTransactions = () => {
    const {activeWallet} = this.props.wallet;
    let transactions = this._getGroupedOrderedTransactions(activeWallet.transactions);
    return (
      <div className={style.TransactionsWrapper}>
        <div className={style.TransactionsHeader}>
          <h2>{activeWallet.name}</h2>
          <p>{this._getWalletAmount()} EMTQ</p>
          <p>Number of transactions: {!!activeWallet.transactions ? activeWallet.transactions.length : 0}</p>
        </div>
        {Object.keys(transactions).map((key) => {
          return (
            <div key={key} className={style.TransactionsSection}>
              <h2>{key}</h2>
              {transactions[key].map((tran) => {
                return (
                  <div className={style.TransactionContainer} key={tran.id}
                       onClick={() => this.setState({selectedTransaction: tran})}>
                    <div className={style.Transaction}>
                      <div className={style.TransactionType}>
                        <FAIcon icon={faReply} size='2x'
                                className={cx(style.Arrow, {
                                  [style.DownArrow]: tran.direction === 'IN',
                                  [style.UpArrow]: tran.direction === 'OUT',
                                })}/>
                        <span>{tran.direction === 'IN' ? 'Receive' : 'Sent'}</span>
                      </div>
                      <div
                        className={style.TransactionAmount}>{(this._getTransactionAmount(tran) / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)} EMTQ
                      </div>
                      <div className={style.AlignRight}>
                        <p>EMTQ {tran.type} transaction</p>
                        <p>{this._getTransactionTime(tran.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  _renderTransactionModal = () => {
    const {selectedTransaction: tran} = this.state;
    return (
      <div className={style.Modal} onClick={() => this.setState({selectedTransaction: null})}>
        <div className={style.ModalContent} onClick={(event) => {
          event.stopPropagation();
        }}>
          <a href="#" className={style.Close} onClick={() => this.setState({selectedTransaction: null})}/>
          <h1>Transaction Details</h1>
          <p><span className={style.TransactionDetail}>Transaction type: </span>EMTQ {tran.type} transaction</p>

          <div className={style.TransactionDetailRow}>
            <div className={style.TransactionDetail}>Transaction&nbsp;ID:</div>
            <div>
              <div className={style.WordWrap}>
                <span>{tran.id}</span>
                <CopyButton copyText={tran.id}/>
              </div>
            </div>
          </div>

          <div className={style.TransactionDetailRow}>
            <div className={style.TransactionDetail}>Included&nbsp;in&nbsp;block:</div>
            <div>
              <div className={style.WordWrap}>
                <span>{tran.block}</span>
              </div>
            </div>
          </div>
          <div className={style.TransactionDateFee}>
            <p>
              <span className={style.TransactionDetail}>Date and Time: </span>
              {this._getTransactionDateTime(tran.timestamp)}
            </p>
            <p>
              <span className={style.TransactionDetail}>Fee: </span>
              {(tran.fee / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)} EMTQ
            </p>
          </div>
          <div className={style.TransactionAssets}>
            <div>
              {tran.inputs.map(input => (
                <div key={input.address} className={style.TransactionAsset}>
                  <p className={style.WordWrap}>{input.address}</p>
                  <p>{(input.amount / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)} EMTQ</p>
                </div>
              ))}
            </div>
            <div className={style.CenterSelfAlign}>
              <FAIcon icon={faArrowAltCircleRight} size={'2x'} inverse='true'/>
            </div>
            <div>
              {tran.outputs.map(output => (
                <div key={output.address} className={style.TransactionAsset}>
                  <p className={style.WordWrap}>{output.address}</p>
                  <p>{(output.amount / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)} EMTQ</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  _renderSend = () => {
    const {sendAmount, sendAddress} = this.state;
    return (
      <div className={style.SendWrapper}>
        <h2>Recipient</h2>
        <input placeholder='Wallet address' value={sendAddress}
               onChange={(e) => this.setState({sendAddress: e.target.value}, this._validateSendInfo)}/>
        <h2 className={style.NoMarginBottom}>Amount</h2>
        <p className={cx(style.Fee, {[style.Warning]: !this._isEnoughMoneyForSend()})}>
          {this._isEnoughMoneyForSend() ?
            ('+' + (this._getFees()).toFixed(EMTQ_DIVISIBILITY) + ' of fees') :
            'I have not enough EMTQ for fees. Try sending a smaller amount'}
        </p>
        <input type='number' min={0} step={Math.pow(0.1, EMTQ_DIVISIBILITY)} value={sendAmount}
               onChange={(e) => this.setState({sendAmount: e.target.value}, this._validateSendInfo)}/>
        <div className={style.ButtonWrapper}>
          <button className={style.Button} disabled={!this.state.isValidSend}
                  onClick={() => this.setState({confirmSendModalIsOpen: true})}>Next
          </button>
        </div>
      </div>
    );
  };

  _renderReceive = () => {
    const {activeWallet} = this.props.wallet;
    return (
      <div className={style.ReceiveWrapper}>
        <div className={style.UnusedAddressWrapper}>
          <div className={style.UnusedAddressInfoWrapper}>
            <QRCode size={96} value={this._getUnusedAddress()}/>
            <div className={style.UnusedAddress}>
              <div className={cx(style.WordWrap, style.FontSize24)}>
                <span>{this._getUnusedAddress()}</span><CopyButton text='Copy' copyText={this._getUnusedAddress()}/>
              </div>
              <p>Your wallet address</p>
            </div>
          </div>
          <p>Share this wallet address to receive payments. To protect your privacy, new addresses are generated
            automatically once you use them</p>
        </div>
        <div className={style.UsedAddressesWrapper}>
          <h2>Used addresses</h2>
          <div>
            {activeWallet.addresses.filter(a => a.used).map(el => <div className={style.UsedAddress} key={el.address}>
                <div>
                  <span className={cx(style.WordWrap, style.FontSize24)}>{el.address}</span>
                </div>
                <CopyButton text='Copy' copyText={el.address}/>
              </div>
            )}
          </div>
        </div>

      </div>
    );
  };

  _renderConfirmSend = () => {
    return (
      <div className={style.Modal} onClick={() => this.setState({confirmSendModalIsOpen: false})}>
        <div className={style.ModalContent} onClick={(event) => {
          event.stopPropagation();
        }}>
          <h1>Confirm Transaction</h1>
          <h2>To</h2>
          <p className={cx(style.WordWrap, style.FontSize24)}>{this.state.sendAddress}</p>
          <div className={style.Columns}>
            <div>
              <h2>Amount</h2>
              <p className={style.Darkred}>{this.state.sendAmount} EMTQ</p>
            </div>
            <div>
              <h2>Fees</h2>
              <p className={style.Pink}>+ {this._getFees().toFixed(EMTQ_DIVISIBILITY)} EMTQ</p>
            </div>
          </div>
          <div>
            <h2>Total</h2>
            <p className={style.Darkred}>
              {(+this.state.sendAmount + this._getFees()).toFixed(EMTQ_DIVISIBILITY)} EMTQ
            </p>
          </div>
          <div className={style.ButtonPanel}>
            <div className={style.ButtonWrapper}>
              <button onClick={() => this.setState({confirmSendModalIsOpen: false})}>Cancel</button>
            </div>
            <div className={style.ButtonWrapper}>
              <button
                onClick={this._sendEMTQ}>Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

class CopyButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false,
      tooltipTimer: null,
    };
  }

  _copy = () => {
    clipboard.writeText(this.props.copyText || '');
    this.setState({showTooltip: true});
    this._timer = setTimeout(() => this.setState({showTooltip: false}), 500);
  };

  componentWillUnmount() {
    clearTimeout(this._timer);
  };

  render = () => (
    <div className={style.CopyWrapper}>
      <div className={style.Copy} onClick={this._copy}>
        {this.state.showTooltip ? <div className={style.Tooltip}> Address has been copied</div> : null}
        <FAIcon icon={faCopy}/>
        {!!this.props.text && <span>{this.props.text}</span>}
      </div>
    </div>
  );
}

export default connect(state => ({
  wallet: state.wallet
}), dispatch => ({
  renameWallet: (name) => dispatch(renameWallet(name)),
  sendEMTQ: (address, amount) => dispatch(sendEMTQ(address, amount))
    .catch((mes) => alert(mes)),
}))(Home);
