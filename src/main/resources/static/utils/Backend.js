class _Backend {
    connection = null;
    connect(connectedMethod) {
        this.connection = new Connection();
        this.connection.connect(connectedMethod);
        return this.connection;
    }
}
class Connection {
    reconnectInterval = null;
    stompClient = null;
    subscriptions = new Map();
    userChargeTransactions = new Map();
    userAwardTransactions = new Map();
    
    constructor() {}

    connect(connectedMethod) {
        if (this.reconnectInterval !== null) {
            clearInterval(this.reconnectInterval);
        }
        this.reconnectInterval = setInterval(() => {
            this.stompClient = Stomp.over(new SockJS('/generic-ws'));
            this.stompClient.connect({}, (frame) => {
                clearInterval(this.reconnectInterval);
                if (connectedMethod !== undefined) {
                    connectedMethod(this);
                }
                this.subscribe('/topic/userCharged', (event)=> {
                    this._onUserChargedReceived(event);
                });
                this.subscribe('/topic/userAwarded', (event)=> {
                    this._onUserAwardedReceived(event);
                });
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