class ProgressStorage extends Storage {
    constructor(onDataChanged) {
        super("7875924a-7b6d-4e24-a09b-993b70d85b87",
                {
                    config: {
                        bitsProgressAmount: 1,
                        redeemProgressAmount: 10,
                        riggingValue: 30,
                        maxInactiveVisibleTime: 20000,
                        showWidgetChatCommand: "!charge"
                    },
                    targetProgress: 0
                },
                onDataChanged);
    }
}