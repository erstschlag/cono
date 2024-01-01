package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.user.UserDto;

public class RaffleEvent extends PlaygroundEvent<RaffleEvent> {

    private final Optional<String> raffleArg1;

    public RaffleEvent(UserDto user, Optional<String> raffleArg1) {
        super(Optional.of(user));
        this.raffleArg1 = raffleArg1;
    }

    public Optional<String> getRaffleArg1() {
        return raffleArg1;
    }

}
