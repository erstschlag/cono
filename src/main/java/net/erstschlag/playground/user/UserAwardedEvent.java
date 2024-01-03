package net.erstschlag.playground.user;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;

public class UserAwardedEvent extends PlaygroundEvent<UserAwardedEvent> {

    private final String transactionId;
    private final float amount;
    private final String reason;

    public UserAwardedEvent(UserDto oUser, String transactionId, float amount, String reason) {
        super(Optional.of(oUser));
        this.transactionId = transactionId;
        this.amount = amount;
        this.reason = reason;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public float getAmount() {
        return amount;
    }

    public String getReason() {
        return reason;
    }

}
