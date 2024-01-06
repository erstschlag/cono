package net.erstschlag.playground.user;

import java.math.BigDecimal;

public class UserChargedEvent extends UserCreditsChangedEvent<UserChargedEvent> {

    public UserChargedEvent(UserDto oUser, String transactionId, BigDecimal amount, String reason) {
        super(oUser, transactionId, amount, reason);
    }
}
