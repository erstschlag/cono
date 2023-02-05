class _Backend {
    connection = null;
    connect(successMethod) {
        this.connection = new Connection();
        this.connection.connect(successMethod);
        return this.connection;
    }
}
class Connection {
    reconnectInterval = null;
    stompClient = null;
    constructor() {}
    ;
            connect(successMethod) {
        if (this.reconnectInterval !== null) {
            clearInterval(this.reconnectInterval);
        }
        this.reconnectInterval = setInterval(() => {
            this.stompClient = Stomp.over(new SockJS('/generic-ws'));
            this.stompClient.connect({}, (frame) => {
                clearInterval(this.reconnectInterval);
                if(successMethod !== undefined){
                    successMethod(this.stompClient);
                }
            }, () => {
                connect(successMethod);
            });
        }, 1000);
    }
    ;
            getStompClient() {
        return this.stompClient;
    }
}
let Backend = new _Backend();
