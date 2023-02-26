package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import net.erstschlag.playground.twitch.user.UserDto;

public class ChannelMessageEvent extends TwitchEvent<ChannelMessageEvent> {

    private final Optional<String> messageId;
    private final String message;

    public ChannelMessageEvent(Object source, Optional<UserDto> oUser, String message, Optional<String> messageId) {
        super(source, oUser);
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
