package net.erstschlag.playground.twitch.pubsub.events;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.user.UserDto;

public class RigEvent extends PlaygroundEvent<RigEvent> {

    private final String consumer;
    private final String command;

    public RigEvent(UserDto user, String consumer, String command) {
        super(Optional.of(user));
        this.consumer = consumer;
        this.command = command;
    }

    public String getConsumer() {
        return consumer;
    }

    public String getCommand() {
        return command;
    }

}
