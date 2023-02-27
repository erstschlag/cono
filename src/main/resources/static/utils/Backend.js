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
            }, () => {
                this.connect(connectedMethod);
            });
        }, 1000);
    }

    subscribe(topicURI, onMessageMethod) {
        if (!this.subscriptions.has(topicURI)) {
            this.subscriptions.set(topicURI, this.stompClient.subscribe(topicURI, function (object) {
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
