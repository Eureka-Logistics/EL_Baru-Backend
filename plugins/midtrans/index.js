const midtransClient = require('midtrans-client');

const {MIDTRANS_ISPRODUCTION, MIDTRANS_SERVERKEY, MIDTRANS_CLIENTKEY} = process.env;

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey : MIDTRANS_SERVERKEY,
    clientKey : MIDTRANS_CLIENTKEY
});

exports.createTransaction = (data) => {
    return snap.createTransaction(data);
}

exports.handleNotification = (notifJson) => {
    return snap.transaction.notification(notifJson);
}