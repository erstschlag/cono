package net.erstschlag.playground.twitch.pubsub.events;

import net.erstschlag.playground.PlaygroundEvent;
import java.util.Optional;
import net.erstschlag.playground.twitch.pubsub.SubTier;
import net.erstschlag.playground.user.UserDto;

public class ChannelSubscribeEvent extends PlaygroundEvent<ChannelSubscribeEvent> {

    private final boolean isGift;
    private final SubTier subTier;

    public ChannelSubscribeEvent(Optional<UserDto> oUser, boolean isGift, SubTier subTier) {
        super(oUser);
        this.isGift = isGift;
        this.subTier = subTier;
    }

    public boolean isGift() {
        return isGift;
    }

    public SubTier getSubTier() {
        return subTier;
    }

}
