package net.erstschlag.playground.twitch.pubsub.events;

import net.erstschlag.playground.PlaygroundEvent;
import java.util.Optional;
import net.erstschlag.playground.user.UserDto;

public class ChannelBitsEvent extends PlaygroundEvent<ChannelBitsEvent> {

    private final Integer bitsUsed;

    public ChannelBitsEvent(Optional<UserDto> oUser, Integer bitsUsed) {
        super(oUser);
        this.bitsUsed = bitsUsed;
    }

    public Integer getBitsUsed() {
        return bitsUsed;
    }

}
