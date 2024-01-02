package net.erstschlag.playground.user;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;

public class UserAwardedEvent extends PlaygroundEvent<UserAwardedEvent> {

    private final Float amount;

    public UserAwardedEvent(UserDto oUser, Float amount) {
        super(Optional.of(oUser));
        this.amount = amount;
    }

    public Float getAmount() {
        return amount;
    }

}
