package net.erstschlag.playground.twitch.eventsub.events;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;

public class ChannelPollEvent extends PlaygroundEvent {
    
    public ChannelPollEvent(Optional oUser) {
        super(oUser);
    }
    
}
