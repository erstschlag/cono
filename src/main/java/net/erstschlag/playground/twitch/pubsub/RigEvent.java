package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.user.UserDto;

public class RigEvent extends PlaygroundEvent<RigEvent> {

    private String consumer;

    public RigEvent(UserDto user, String consumer) {
        super(Optional.of(user));
        this.consumer = consumer;
    }

    public String getConsumer() {
        return consumer;
    }

}
