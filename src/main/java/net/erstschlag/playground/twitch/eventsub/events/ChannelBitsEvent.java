package net.erstschlag.playground.twitch.eventsub.events;

import net.erstschlag.playground.PlaygroundEvent;
import java.util.Optional;
import net.erstschlag.playground.user.UserDto;

public class ChannelBitsEvent extends PlaygroundEvent<ChannelBitsEvent> {

    private final Integer bitsUsed;
    private final String message;

    public ChannelBitsEvent(Optional<UserDto> oUser, Integer bitsUsed, String message) {
        super(oUser);
        this.bitsUsed = bitsUsed;
        this.message = message;
    }

    public Integer getBitsUsed() {
        return bitsUsed;
    }

    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return "ChannelBitsEvent{" + "bitsUsed=" + bitsUsed + ", message=" + message + '}';
    }

}
