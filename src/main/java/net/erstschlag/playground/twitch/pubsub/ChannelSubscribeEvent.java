package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import net.erstschlag.playground.twitch.user.UserDto;

public class ChannelSubscribeEvent extends TwitchEvent<ChannelSubscribeEvent> {

    private final boolean isGift;
    private final SubTier subTier;

    public ChannelSubscribeEvent(Object source, Optional<UserDto> oUser, boolean isGift, SubTier subTier) {
        super(source, oUser);
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
