package net.erstschlag.playground.twitch.pubsub;

import net.erstschlag.playground.PlaygroundEvent;
import java.util.Optional;
import net.erstschlag.playground.user.UserDto;

public class RewardRedeemedEvent extends PlaygroundEvent<RewardRedeemedEvent> {

    private final String title;
    private final String userInput;
    private final long channelPointsUsed;

    public RewardRedeemedEvent(Optional<UserDto> oUser, String title, String userInput, long channelPointsUsed) {
        super(oUser);
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
