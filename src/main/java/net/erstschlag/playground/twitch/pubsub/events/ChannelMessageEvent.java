package net.erstschlag.playground.twitch.pubsub.events;

import net.erstschlag.playground.PlaygroundEvent;
import java.util.Optional;
import net.erstschlag.playground.user.UserDto;

public class ChannelMessageEvent extends PlaygroundEvent<ChannelMessageEvent> {

    private final Optional<String> messageId;
    private final String message;

    public ChannelMessageEvent(Optional<UserDto> oUser, String message, Optional<String> messageId) {
        super(oUser);
        this.message = message;
        this.messageId = messageId;
    }

    public String getMessage() {
        return message;
    }

    public Optional<String> getMessageId() {
        return messageId;
    }

}
