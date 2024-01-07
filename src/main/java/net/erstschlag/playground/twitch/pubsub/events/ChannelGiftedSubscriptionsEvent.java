package net.erstschlag.playground.twitch.pubsub.events;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.twitch.pubsub.SubTier;
import net.erstschlag.playground.user.UserDto;

public class ChannelGiftedSubscriptionsEvent extends PlaygroundEvent<ChannelGiftedSubscriptionsEvent> {

    private final SubTier subTier;
    private final int count;

    public ChannelGiftedSubscriptionsEvent(Optional<UserDto> oUser, SubTier subTier, int count) {
        super(oUser);
        this.subTier = subTier;
        this.count = count;
    }

    public SubTier getSubTier() {
        return subTier;
    }

    public int getCount() {
        return count;
    }

}
