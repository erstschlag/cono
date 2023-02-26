package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import net.erstschlag.playground.twitch.user.UserDto;
import org.springframework.context.ApplicationEvent;

public abstract class TwitchEvent<T extends TwitchEvent> extends ApplicationEvent {

    private final Optional<UserDto> oUser;

    public TwitchEvent(Object source, Optional<UserDto> oUser) {
        super(source);
        this.oUser = oUser;
    }

    public Optional<UserDto> getUser() {
        return oUser;
    }
}
