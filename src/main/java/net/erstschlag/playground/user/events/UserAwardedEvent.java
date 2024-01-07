package net.erstschlag.playground.user.events;

import java.math.BigDecimal;
import net.erstschlag.playground.user.UserDto;

public class UserAwardedEvent extends UserCreditsChangedEvent<UserAwardedEvent> {

    public UserAwardedEvent(UserDto oUser, String transactionId, BigDecimal amount, String reason) {
        super(oUser, transactionId, amount, reason);
    }
}
