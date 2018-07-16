const rx = require('rxjs');
const URL = 'ws://localhost:3145/wallet';
let WS = null;
let idCounter = 0;
let messages = {};
let subscribers = [];


export function connect() {
  let ws = new WebSocket(URL);
  ws.onopen = function (evt) {
    console.log(evt);
  };
  ws.onmessage = onMessage;
  ws.onclose = function (evt) {
    console.log(evt);
  };
  ws.onerror = function (evt) {
    console.log(evt);
  };
  WS = ws;
  return new Promise((resolve) => {
    waitForConnection(resolve, 1000);
  });
}

function onMessage(evt) {
  let data = JSON.parse(evt.data);
  let id = data.id;
  console.log(evt.data);
  if (id !== undefined) {
    if (messages[id]) {
      data.result ?
        messages[id].next(data.result) && messages[id].complete() :
        messages[id].error(data.error.message);
    }

  } else {
    subscribers.filter(l => l.channel === data.method).forEach(s => s.observer.next(data.params));
  }
}

function prepareRequest(method, params) {
  return {
    jsonrpc: '2.0',
    id: ++idCounter,
    method: method,
    params: params,
  };
}

function send(mes) {
  let resp = rx.Observable.create((observer) => {
    messages[mes.id] = observer;
  });
  waitForConnection(() => {
    return WS.send(JSON.stringify(mes));
  }, 1000);
  return resp;
}

function subscribe(channel) {
  let obs;
  let subscriber = rx.Observable.create((observer) => {
    obs = observer;
  });
  send(prepareRequest('subscribe', [channel]))
    .subscribe(
      (data) => {
        !!data ? subscribers.push({channel: 'consensus', observer: obs}) :
          obs.error(data.message);
      },
      (error) => {
        obs.error(error);
      }
    );
  return subscriber;
}

export function ping() {
  send(prepareRequest('ping', null));
}

export function sync() {
  return subscribe('consensus');
}

export function getRecoveryPhrase() {
  return send(prepareRequest('recovery-phrase'));
}

export function getWallet() {
  return send(prepareRequest('wallet'));
}

export function getTransactions() {
  return send(prepareRequest('transactions'));
}

function waitForConnection(callback, interval) {
  if (!!WS && WS.readyState === 1) {
    callback();
  } else {
    setTimeout(function () {
      waitForConnection(callback, interval);
    }, interval);
  }
}
