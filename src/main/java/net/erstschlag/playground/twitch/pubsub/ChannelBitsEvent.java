package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import net.erstschlag.playground.twitch.user.UserDto;

public class ChannelBitsEvent extends TwitchEvent<ChannelBitsEvent> {

    private final Integer bitsUsed;

    public ChannelBitsEvent(Object source, Optional<UserDto> oUser, Integer bitsUsed) {
        super(source, oUser);
        this.bitsUsed = bitsUsed;
    }

    public Integer getBitsUsed() {
        return bitsUsed;
    }

}
