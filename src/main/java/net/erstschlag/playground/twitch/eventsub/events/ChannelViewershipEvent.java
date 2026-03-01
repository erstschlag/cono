package net.erstschlag.playground.twitch.eventsub.events;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;

public class ChannelViewershipEvent extends PlaygroundEvent<ChannelViewershipEvent> {

    private final Integer viewerCount;
    private final Integer chatterCount;

    public ChannelViewershipEvent(Integer viewerCount, Integer chatterCount) {
        super(Optional.empty());
        this.viewerCount = viewerCount;
        this.chatterCount = chatterCount;
    }

    public Integer getViewerCount() {
        return viewerCount;
    }

    public Integer getChatterCount() {
        return chatterCount;
    }

    @Override
    public String toString() {
        return super.toString() + " => ChannelViewershipEvent{" + "viewerCount=" + viewerCount + ", chatterCount=" + chatterCount + '}';
    }

}
