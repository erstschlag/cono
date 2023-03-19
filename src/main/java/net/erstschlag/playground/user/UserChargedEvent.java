package net.erstschlag.playground.user;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;

public class UserChargedEvent extends PlaygroundEvent<UserChargedEvent> {

    private final String transactionId;
    private final Integer amount;
    private final String reason;

    public UserChargedEvent(UserDto oUser, String transactionId, Integer amount, String reason) {
        super(Optional.of(oUser));
        this.transactionId = transactionId;
        this.amount = amount;
        this.reason = reason;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public Integer getAmount() {
        return amount;
    }

    public String getReason() {
        return reason;
    }

}
