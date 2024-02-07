class Backend {
    reconnectInterval;
    stompClient;
    subscriptions = new Map();
    userChargeTransactions = new Map();
    userAwardTransactions = new Map();
    storage = undefined;
    constructor(onConnectMethod, storage) {
        this.#connect(onConnectMethod, storage);
    }

    sendObject(destination, object) {
        this.stompClient.send(destination, {}, JSON.stringify(object));
    }

    sendStr(destination, str) {
        this.stompClient.send(destination, {}, str);
    }

    chargeUser(userId, chargingAmount, chargingReason, onSuccessMethod) {
        this.#awardChargeUser(userId, chargingAmount, chargingReason, onSuccessMethod, false);
    }

    awardUser(userId, awardAmount, awardReason, onSuccessMethod) {
        this.#awardChargeUser(userId, awardAmount, awardReason, onSuccessMethod, true);
    }

    subscribe(topicURI, onMessageMethod) {
        if (!this.subscriptions.has(topicURI)) {
            this.subscriptions.set(topicURI, this.stompClient.subscribe(topicURI, (object) => {
                onMessageMethod(JSON.parse(object.body));
            }));
        }
    }

    pushStorage() {
        if (this.storage !== undefined) {
            this.sendObject("/app/store", {
                uuid: this.storage.uuid,
                data: JSON.stringify(this.storage.data)
            });
        }
    }

    #connect(connectedMethod, storage) {
        this.storage = storage;
        if (this.reconnectInterval !== undefined) {
            clearInterval(this.reconnectInterval);
        }
        this.reconnectInterval = setInterval(() => {
            this.stompClient = Stomp.over(new SockJS('/generic-ws'));
            this.stompClient.connect({}, (frame) => {
                clearInterval(this.reconnectInterval);
                this.subscribe('/topic/userCharged', (event) => {
                    this.#onUserChargedReceived(event);
                });
                this.subscribe('/topic/userAwarded', (event) => {
                    this.#onUserAwardedReceived(event);
                });
                this.subscribe('/topic/store', (event) => {
                    this.#onStorageEventReceived(event);
                });
                if (connectedMethod !== undefined) {
                    connectedMethod(this);
                }
                if (this.storage !== undefined) {
                    this.#pullFromStorage();
                }
            }, () => {
                this.connect(connectedMethod);
            });
        }, 1000);
    }

    #awardChargeUser(userId, amount, reason, onSuccessMethod, isAward) {
        var transactionId = crypto.randomUUID();
        if (isAward) {
            this.userAwardTransactions.set(transactionId, onSuccessMethod);
        } else {
            this.userChargeTransactions.set(transactionId, onSuccessMethod);
        }
        this.sendObject(isAward?"/app/awardUser":"/app/chargeUser",
                {
                    userId: userId,
                    amount: amount,
                    reason: reason,
                    transactionId: transactionId
                }
        );
    }
    
    #pullFromStorage() {
        this.sendStr("/app/loadFromStorage", this.storage.uuid);
    }

    #onStorageEventReceived(storageEvent) {
        if (this.storage !== undefined && this.storage.uuid === storageEvent.uuid) {
            if (storageEvent.data !== null) {
                storageEvent.data = JSON.parse(storageEvent.data);
                this.storage.eventReceived(storageEvent);
            } else {
                this.pushStorage();
            }
        }
    }

    #onUserChargedReceived(userChargedEvent) {
        var onUserChargeSuccess = this.userChargeTransactions.get(userChargedEvent.transactionId);
        if (onUserChargeSuccess !== undefined) {
            onUserChargeSuccess();
            this.userChargeTransactions.delete(userChargedEvent.transactionId);
        }
    }

    #onUserAwardedReceived(userAwardedEvent) {
        var onUserAwardSuccess = this.userAwardTransactions.get(userAwardedEvent.transactionId);
        if (onUserAwardSuccess !== undefined) {
            onUserAwardSuccess();
            this.userAwardTransactions.delete(userAwardedEvent.transactionId);
        }
    }
}

class Storage {
    uuid;
    onDataChanged;
    data;
    constructor(uuid, data, onDataChanged) {
        this.uuid = uuid;
        this.data = data;
        this.onDataChanged = onDataChanged;
    }
    eventReceived(event) {
        this.data = event.data;
        this.onDataChanged();
    }
}