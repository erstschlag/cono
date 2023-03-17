package net.erstschlag.playground.user;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;

public class UserAwardedEvent extends PlaygroundEvent<UserAwardedEvent> {

    private final Integer amount;

    public UserAwardedEvent(UserDto oUser, Integer amount) {
        super(Optional.of(oUser));
        this.amount = amount;
    }

    public Integer getAmount() {
        return amount;
    }

}
