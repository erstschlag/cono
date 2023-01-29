package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import com.github.philippheuer.events4j.core.domain.Event;
import net.erstschlag.playground.twitch.user.UserDto;
import org.springframework.context.ApplicationEvent;
import org.springframework.core.ResolvableType;
import org.springframework.core.ResolvableTypeProvider;

public class TwitchEvent<T extends Event> extends ApplicationEvent implements ResolvableTypeProvider {

    private final T event;
    private final Optional<UserDto> oUser;

    public TwitchEvent(Object source, T event, Optional<UserDto> oUser) {
        super(source);
        this.event = event;
        this.oUser = oUser;
    }

    public T getEvent() {
        return event;
    }

    public Optional<UserDto> getUser() {
        return oUser;
    }

    @Override
    public ResolvableType getResolvableType() {
        return ResolvableType.forClassWithGenerics(
                getClass(),
                ResolvableType.forInstance(this.event)
        );
    }
}
