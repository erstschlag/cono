package net.erstschlag.playground.twitch.eventsub.events;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.user.UserDto;

public class ChatMessageEvent extends PlaygroundEvent<ChatMessageEvent> {

    private final String message;

    public ChatMessageEvent(Optional<UserDto> user, String message) {
        super(user);
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return super.toString() + " => ChatMessageEvent{" + "message=" + message + '}';
    }

}
