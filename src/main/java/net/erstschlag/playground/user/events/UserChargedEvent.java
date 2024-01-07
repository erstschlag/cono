package net.erstschlag.playground.user.events;

import java.math.BigDecimal;
import net.erstschlag.playground.user.UserDto;

public class UserChargedEvent extends UserCreditsChangedEvent<UserChargedEvent> {

    public UserChargedEvent(UserDto oUser, String transactionId, BigDecimal amount, String reason) {
        super(oUser, transactionId, amount, reason);
    }
}
