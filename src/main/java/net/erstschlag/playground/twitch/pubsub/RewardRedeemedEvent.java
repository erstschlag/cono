package net.erstschlag.playground.twitch.pubsub;

import java.util.Optional;
import net.erstschlag.playground.twitch.user.UserDto;

public class RewardRedeemedEvent extends TwitchEvent<RewardRedeemedEvent> {

    private final String title;
    private final String userInput;
    private final long channelPointsUsed;

    public RewardRedeemedEvent(Object source, Optional<UserDto> oUser, String title, String userInput, long channelPointsUsed) {
        super(source, oUser);
        this.title = title;
        this.userInput = userInput;
        this.channelPointsUsed = channelPointsUsed;
    }

    public String getTitle() {
        return title;
    }

    public String getUserInput() {
        return userInput;
    }

    public long getChannelPointsUsed() {
        return channelPointsUsed;
    }

}
