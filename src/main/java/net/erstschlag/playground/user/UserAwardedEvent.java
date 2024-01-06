package net.erstschlag.playground.user;

import java.math.BigDecimal;

public class UserAwardedEvent extends UserCreditsChangedEvent<UserAwardedEvent> {

    public UserAwardedEvent(UserDto oUser, String transactionId, BigDecimal amount, String reason) {
        super(oUser, transactionId, amount, reason);
    }
}
