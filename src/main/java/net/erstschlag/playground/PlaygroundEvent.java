package net.erstschlag.playground;

import java.util.Optional;
import net.erstschlag.playground.user.UserDto;

public abstract class PlaygroundEvent<T extends PlaygroundEvent> {

    private final Optional<UserDto> oUser;

    public PlaygroundEvent(Optional<UserDto> oUser) {
        this.oUser = oUser;
    }

    public Optional<UserDto> getUser() {
        return oUser;
    }

    @Override
    public String toString() {
        return "PlaygroundEvent{" + "oUser=" + oUser + '}';
    }
}
