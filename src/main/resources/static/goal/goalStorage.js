class GoalStorage extends Storage {
    constructor(onDataChanged) {
        super("d7792d16-83ec-40a8-939c-acf9a603495e",
                {
                    config: {
                        enabled: false,
                        riggingValue: 10
                    },
                    currentValue: 0
                },
                onDataChanged);
    }
}