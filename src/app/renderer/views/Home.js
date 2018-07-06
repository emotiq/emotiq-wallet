import React, {Component} from 'react';
import {connect} from 'react-redux';
import {clipboard} from 'electron';
import {getWallet, renameWallet, sendEMTQ} from '../actions/wallet';
import cx from 'classnames';
import QRCode from 'qrcode.react';
import _ from 'lodash';
import {EMTQ_DIVISIBILITY, FEE, POWER_DIVISIBILITY} from '../../shared/constants/config';

import style from './Home.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.props.getWallet();

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

  _getTrimmedAddress = (address, leftPartlength = 10, rightPartLenght = 10) => {
    return address.substr(0, leftPartlength) + '...' + address.slice(-rightPartLenght);
  };

  render = () => {
    const {activeWallet} = this.props.wallet;
    const {activeTab, confirmSendModalIsOpen} = this.state;
    return (
      <div>
        {!!activeWallet ? (
            <div className={style.Home}>
              <div className={style.WalletHeader}>
                <img src={'../images/logo-text.svg'} className={style.WalletHeaderLogo}/>
                <input typeof={'text'} value={this.state.walletName} disabled={!this.state.editWalletName}
                       id={'walletName'}
                       onChange={(e) => this.setState({walletName: e.target.value})}
                       onKeyDown={this._onKeyPressWalletName}
                       onBlur={this._changeWalletName} className={style.WalletName}/>
                <div className={style.WalletHeaderBalance}>
                  <span>{(this._getWalletAmount()).toFixed(EMTQ_DIVISIBILITY)} EMTQ</span>
                  <img src={'../images/info.svg'}/>
                </div>
                <img className={style.Rename} src={'../images/dots-vert.svg'} onClick={() => {
                  this.setState({editWalletName: true});
                  let header = document.getElementById('walletName');
                  setTimeout(() => header.focus(), 0);
                }}/>
              </div>
              <div className={style.WalletMenu}>
                <div className={`${style.MenuTab} ${activeTab === 'transactions' ? style.Active : ''}`}
                     onClick={() => this.setState({activeTab: 'transactions'})}>
                  <img src={'../images/transactions-ico.svg'} className={style.MenuTabIcon}/>
                  <span>Transactions</span>
                </div>
                <div className={`${style.MenuTab} ${activeTab === 'send' ? style.Active : ''}`}
                     onClick={() => this.setState({activeTab: 'send'})}>
                  <img src={'../images/send-ico.svg'} className={style.MenuTabIcon}/>
                  <span>Send</span>
                  <img src={'../images/info.svg'}/>
                </div>
                <div className={`${style.MenuTab} ${activeTab === 'receive' ? style.Active : ''}`}
                     onClick={() => this.setState({activeTab: 'receive'})}>
                  <img src={'../images/receive-ico.svg'} className={style.MenuTabIcon}/>
                  <span>Receive</span>
                  <img src={'../images/info.svg'}/>
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
          <h2>My balance</h2>
          <p className={style.TransactionsHeaderBalance}>{this._getWalletAmount()} <span
            className={style.TransactionsHeaderBalanceLabel}>EMTQ</span></p>
          <div className={style.TransactionsHeaderAddress}>
            <span>{this._getTrimmedAddress(activeWallet.address)}</span>
            <img src={'../images/info.svg'}/>
          </div>
          <img src={'../images/wallet.svg'}/>
        </div>
        <div className={style.TransactionsFilters}>
          <span className={style.NumberOfTransactions}>Number of transactions:
            <span
              className={style.NumberOfTransactionsLabel}>{!!activeWallet.transactions ? activeWallet.transactions.length : 0}</span>
          </span>
          <div className={style.DateFilter}>
            <span>From </span>
            <input value="Dec 08. 2017"/>
            <span>To </span>
            <input value="Dec 08. 2017"/>
          </div>
          <div className={style.StatusFilter}>
            <span className={style.StatusSelected}>all</span>
            <span>received</span>
            <span>send</span>
            <span>recent</span>
          </div>
        </div>
        {Object.keys(transactions).map((key) => {
          return (
            <div key={key} className={style.TransactionsSection}>
              <span className={style.TransactionDate}>{key}</span>
              {transactions[key].map((tran) => {
                return (
                  <div className={style.Transaction} key={tran.id}
                       onClick={() => this.setState({selectedTransaction: tran})}>
                    <div>
                      <img src={`../images/${tran.direction === 'IN' ? 'in' : 'out'}.svg`}/>
                      <span className={style.TransactionDirection}>{tran.direction}</span>
                    </div>
                    <div className={style.TransactionAmount}>
                      {(this._getTransactionAmount(tran) / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)} EMTQ
                    </div>
                    <div className={style.TransactionAddress}>
                      <img src={`../images/${tran.direction === 'IN' ? 'in' : 'out'}-arrow.svg`}/>
                      <span className={style.TransactionId}>{tran.id}</span>
                    </div>
                    <div className={style.AlignRight}>
                      <span className={style.TransactionTime}>{this._getTransactionTime(tran.timestamp)}</span>
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
        <div className={style.ModalContent} onClick={(event) => event.stopPropagation()}>

          <h1>Transaction Details</h1>
          <div className={style.TransactionDetails}>
            <div className={cx(style.TransactionDetailsLabel, style.TransactionTypeLabel)}>Transaction type:</div>
            <div className={style.TransactionTypeRow}>
              <img src={`../images/${tran.direction === 'IN' ? 'in' : 'out'}.svg`}/>
              <span className={style.TransactionDirection}>{tran.direction}</span>
              <span className={style.TransactionTypeLabel}>EMTQ {tran.type} transaction</span>
            </div>

            <div className={cx(style.TransactionDetailsLabel, style.TransactionIdLabel)}>Transaction&nbsp;ID:</div>
            <div className={style.TransactionIdRow}>
              <div className={style.TransactionIdCopy}>
                <img src={`../images/${tran.direction === 'IN' ? 'in' : 'out'}-arrow.svg`}/>
                <span>{tran.id}</span>
                <CopyButton copyText={tran.id}/>
              </div>
            </div>

            <div
              className={cx(style.TransactionDetailsLabel, style.TransactionBlockLabel)}>Included&nbsp;in&nbsp;block:
            </div>
            <div className={style.TransactionBlockRow}>{this._getTrimmedAddress(tran.block, 20, 15)}</div>

            <div className={style.TransactionDateRow}>
              <span className={style.TransactionDetailsLabel}>Date and Time: </span>
              <div className={style.TransactionRowDate}>
                <span>{this._getTransactionDateTime(tran.timestamp)}</span>
              </div>
            </div>
            <div className={style.TransactionFeeRow}>
              <span className={style.TransactionDetailsLabel}>Fee: </span>
              <div className={style.TransactionRowDate}>
                <span>{(tran.fee / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)} EMTQ</span>
              </div>
            </div>

          </div>
          <div className={style.TransactionAssets}>
            <div>
              {tran.inputs.map(input => (
                <div key={input.address} className={style.TransactionAsset}>
                  <div className={style.TransactionRowDate}>
                    <span>{this._getTrimmedAddress(input.address, 20)}</span>
                  </div>
                  <span
                    className={style.TransactionAssetAmount}>{(input.amount / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)} EMTQ</span>
                </div>
              ))}
            </div>
            <img className={style.AssetsArrow} src={'../images/out-arrow.svg'}/>
            <div>
              {tran.outputs.map(output => (
                <div key={output.address} className={style.TransactionAsset}>
                  <div className={style.TransactionRowDate}>
                    <span>{this._getTrimmedAddress(output.address, 20)}</span>
                  </div>
                  <span
                    className={style.TransactionAssetAmount}>{(output.amount / POWER_DIVISIBILITY).toFixed(EMTQ_DIVISIBILITY)} EMTQ</span>
                </div>
              ))}
            </div>
            <button className={style.Button} style={{margin: 'auto'}}
                    onClick={() => this.setState({selectedTransaction: null})}>Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  _renderSend = () => {
    const {sendAmount, sendAddress} = this.state;
    return (
      <div className={style.SendWrapper}>
        <h2>Confirm Transaction</h2>
        <div className={cx(style.SendInputGroup, style.SendTo)}>
          <span>To:</span>
          <input placeholder='Wallet address' value={sendAddress}
                 onChange={(e) => this.setState({sendAddress: e.target.value}, this._validateSendInfo)}/>
        </div>
        <div className={cx(style.SendInputGroup, style.SendAmount)}>
          <span>Amount</span>
          <input type='number' min={0} step={Math.pow(0.1, EMTQ_DIVISIBILITY)} value={sendAmount}
                 onChange={(e) => this.setState({sendAmount: e.target.value}, this._validateSendInfo)}/>
        </div>
        <div className={cx(style.SendInputGroup, style.SendFees)}>
          <span>Fees</span>
          <input value={this._getFees().toFixed(EMTQ_DIVISIBILITY)} disabled={true}/>
        </div>
        <div className={cx(style.SendInputGroup, style.SendTotal)}>
          <span>Total</span>
          <input style={{color: this._isEnoughMoneyForSend() ? 'white' : '#FF5704'}}
                 value={(parseFloat(this.state.sendAmount) + parseFloat(this._getFees())).toFixed(EMTQ_DIVISIBILITY)}
                 disabled={true}/>
        </div>
        <button className={style.Button} disabled={!this.state.isValidSend}
                onClick={() => this.setState({confirmSendModalIsOpen: true})}>
          Send
          <img src={'../images/arrow-next.svg'}/>
        </button>
      </div>
    );
  };

  _renderReceive = () => {
    const {activeWallet} = this.props.wallet;
    return (
      <div className={style.ReceiveWrapper}>
        <h2 className={style.ReceiveTitle}>Your wallet address</h2>
        <div className={style.UnusedAddressInfoWrapper}>
          <div className={style.ReceiveQrWrapper}>
            <QRCode size={111} value={this._getUnusedAddress()}/>
          </div>
          <div className={style.ReceiveAddress}>
            <span>{this._getUnusedAddress()}</span>
            <CopyButton text='Copy' copyText={this._getUnusedAddress()}/>
          </div>
        </div>
        <p>Share this wallet address to receive payments.<br/>To protect your privacy, new addresses are generated
          automatically once you use them</p>
        <div className={style.UsedAddressesWrapper}>
          <h2>Used addresses</h2>
          <div>
            {activeWallet.addresses.filter(a => a.used).map(el => <div className={style.UsedAddress} key={el.address}>
                <span>{this._getTrimmedAddress(el.address, 25)}</span>
                <CopyButton copyText={el.address}/>
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
          <div className={style.SendInputGroup}>
            <span>To</span>
            <p>{this.state.sendAddress}</p>
          </div>
          <div className={style.Columns}>
            <div className={style.SendInputGroup}>
              <span>Amount</span>
              <p>{this.state.sendAmount} EMTQ</p>
            </div>
            <div className={style.SendInputGroup}>
              <span>Fees</span>
              <p>+ {this._getFees().toFixed(EMTQ_DIVISIBILITY)} EMTQ</p>
            </div>
          </div>
          <div className={style.SendInputGroup}>
            <span>Total</span>
            <p>
              {(+this.state.sendAmount + this._getFees()).toFixed(EMTQ_DIVISIBILITY)} EMTQ
            </p>
          </div>
          <div className={style.ButtonPanel}>
            <div className={style.ButtonWrapper}>
              <button className={style.Button} onClick={() => this.setState({confirmSendModalIsOpen: false})}>Cancel
              </button>
            </div>
            <div className={style.ButtonWrapper}>
              <button className={style.Button}
                      onClick={this._sendEMTQ}>
                Send
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
    this._timer = setTimeout(() => this.setState({showTooltip: false}), 1000);
  };

  componentWillUnmount() {
    clearTimeout(this._timer);
  };

  render = () => (
    <div className={style.CopyWrapper}>
      <div className={style.Copy} onClick={this._copy}>
        {this.state.showTooltip ? <div className={style.Tooltip}> Address has been copied</div> : null}
        <img src={'../images/ico-copy.svg'}/>
      </div>
    </div>
  );
}

export default connect(state => ({
  wallet: state.wallet
}), dispatch => ({
  renameWallet: (name) => dispatch(renameWallet(name)),
  getWallet: () => dispatch(getWallet()),
  sendEMTQ: (address, amount) => dispatch(sendEMTQ(address, amount))
    .catch((mes) => alert(mes)),
}))(Home);
