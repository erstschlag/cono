package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.user.UserDto;

public class RaffleEvent extends PlaygroundEvent<RaffleEvent> {

    public RaffleEvent(UserDto user) {
        super(Optional.of(user));
    }

}
