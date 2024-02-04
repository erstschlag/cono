const GOAL_STORAGE_UUID = "d7792d16-83ec-40a8-939c-acf9a603495e";

class _Store {
    state = {
        config: {
            enabled: false,
            riggingValue: 10
        },
        currentValue: 0
    };
    push() {
        backend.store(GOAL_STORAGE_UUID, store.state);
    }
    pull() {
        backend.loadFromStorage(GOAL_STORAGE_UUID);
    }
    storageEventReceived(event) {
        if (event.uuid !== GOAL_STORAGE_UUID) {
            return;
        }
        if (event.data !== null) {
            store.state = event.data;
        } else {
            store.push();
        }
    }
}

let store = new _Store();