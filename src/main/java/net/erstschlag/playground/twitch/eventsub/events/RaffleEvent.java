package net.erstschlag.playground.twitch.eventsub.events;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.user.UserDto;

public class RaffleEvent extends PlaygroundEvent<RaffleEvent> {

    private final Optional<String> raffleArg1;

    public RaffleEvent(Optional<UserDto> user, Optional<String> raffleArg1) {
        super(user);
        this.raffleArg1 = raffleArg1;
    }

    public Optional<String> getRaffleArg1() {
        return raffleArg1;
    }

    @Override
    public String toString() {
        return super.toString() + " => RaffleEvent{" + "raffleArg1=" + raffleArg1 + '}';
    }

}
