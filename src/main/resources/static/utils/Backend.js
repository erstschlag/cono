class _Backend {
    connection = null;
    connect(connectedMethod, storageEventReceivedMethod) {
        this.connection = new Connection();
        this.connection.connect(connectedMethod, storageEventReceivedMethod);
        return this.connection;
    }
}
class Connection {
    reconnectInterval = null;
    stompClient = null;
    subscriptions = new Map();
    userChargeTransactions = new Map();
    userAwardTransactions = new Map();
    storageRequests = new Map();
    storageEventReceivedMethod = undefined;
    
    constructor() {}

    connect(connectedMethod, storageEventReceivedMethod) {
        this.storageEventReceivedMethod = storageEventReceivedMethod;
        if (this.reconnectInterval !== null) {
            clearInterval(this.reconnectInterval);
        }
        this.reconnectInterval = setInterval(() => {
            this.stompClient = Stomp.over(new SockJS('/generic-ws'));
            this.stompClient.connect({}, (frame) => {
                clearInterval(this.reconnectInterval);
                this.subscribe('/topic/userCharged', (event)=> {
                    this._onUserChargedReceived(event);
                });
                this.subscribe('/topic/userAwarded', (event)=> {
                    this._onUserAwardedReceived(event);
                });
                this.subscribe('/topic/store', (event)=> {
                    this._onStorageEventReceived(event);
                });
                if (connectedMethod !== undefined) {
                    connectedMethod(this);
                }
            }, () => {
                this.connect(connectedMethod);
            });
        }, 1000);
    }

    chargeUser(userId, chargingAmount, chargingReason, onSuccessMethod) {
        var transactionId = crypto.randomUUID();
        this.userChargeTransactions.set(transactionId, onSuccessMethod);
        this.sendObject("/app/chargeUser",
                {
                    userId: userId,
                    amount: chargingAmount,
                    reason: chargingReason,
                    transactionId: transactionId
                }
        );
    }
    
    awardUser(userId, awardAmount, awardReason, onSuccessMethod) {
        var transactionId = crypto.randomUUID();
        this.userAwardTransactions.set(transactionId, onSuccessMethod);
        this.sendObject("/app/awardUser",
                {
                    userId: userId,
                    amount: awardAmount,
                    reason: awardReason,
                    transactionId: transactionId
                }
        );
    }
    
    loadFromStorage(uuid, onSuccessMethod) {
        if(onSuccessMethod !== undefined) {
            this.storageRequests.set(uuid, onSuccessMethod);
        }
        this.sendStr("/app/loadFromStorage", uuid);
    }
    
    store(uuid, data, onSuccessMethod) {
        if(onSuccessMethod !== undefined) {
            this.storageRequests.set(uuid, onSuccessMethod);
        }
        this.sendObject("/app/store", {
            uuid: uuid,
            data: data
        });
    }

    _onStorageEventReceived(storageEvent) {
        var onStorageSuccess = this.storageRequests.get(storageEvent.uuid);
        if (onStorageSuccess !== undefined) {
            onStorageSuccess(storageEvent);
            this.storageRequests.delete(storageEvent.uuid);
        }
        if (this.storageEventReceivedMethod !== undefined) {
            this.storageEventReceivedMethod(storageEvent);
        }
    }

    _onUserChargedReceived(userChargedEvent) {
        var onUserChargeSuccess = this.userChargeTransactions.get(userChargedEvent.transactionId);
        if(onUserChargeSuccess !== undefined){
            onUserChargeSuccess();
            this.userChargeTransactions.delete(userChargedEvent.transactionId);
        }
    }

    _onUserAwardedReceived(userAwardedEvent) {
        var onUserAwardSuccess = this.userAwardTransactions.get(userAwardedEvent.transactionId);
        if(onUserAwardSuccess !== undefined){
            onUserAwardSuccess();
            this.userAwardTransactions.delete(userAwardedEvent.transactionId);
        }
    }

    subscribe(topicURI, onMessageMethod) {
        if (!this.subscriptions.has(topicURI)) {
            this.subscriptions.set(topicURI, this.stompClient.subscribe(topicURI, (object) => {
                onMessageMethod(JSON.parse(object.body));
            }));
        }
    }
    
    sendObject(destination, object) {
        this.stompClient.send(destination, {}, JSON.stringify(object));
    }
    
    sendStr(destination, str) {
        this.stompClient.send(destination, {}, str);
    }
}
let Backend = new _Backend();