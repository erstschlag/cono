package net.erstschlag.playground.twitch.pubsub;

import com.github.twitch4j.chat.events.channel.ChannelMessageEvent;
import com.github.twitch4j.pubsub.events.ChannelBitsEvent;
import com.github.twitch4j.pubsub.events.ChannelSubscribeEvent;
import com.github.twitch4j.pubsub.events.RewardRedeemedEvent;
import java.util.Optional;
import net.erstschlag.playground.twitch.user.UserDto;
import net.erstschlag.playground.twitch.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Twitch4JEventWrapper {

    private final UserService userService;

    @Autowired
    public Twitch4JEventWrapper(UserService userService) {
        this.userService = userService;
    }

    public TwitchEvent<RewardRedeemedEvent> wrap(RewardRedeemedEvent rRE) {
        return new TwitchEvent<>(this, rRE,
                extractUser(
                        rRE.getRedemption().getUser().getId(),
                        rRE.getRedemption().getUser().getLogin()
                ));
    }

    public TwitchEvent<ChannelBitsEvent> wrap(ChannelBitsEvent cBE) {
        return new TwitchEvent<>(this, cBE,
                extractUser(
                        cBE.getData().getUserId(),
                        cBE.getData().getUserName()
                ));
    }

    public TwitchEvent<ChannelSubscribeEvent> wrap(ChannelSubscribeEvent cSE) {
        return new TwitchEvent<>(this, cSE,
                extractUser(
                        cSE.getData().getUserId(),
                        cSE.getData().getUserName()
                ));
    }

    public TwitchEvent<ChannelMessageEvent> wrap(ChannelMessageEvent cME) {
        return new TwitchEvent<>(this, cME,
                extractUser(
                        cME.getUser().getId(),
                        cME.getUser().getName()
                ));
    }

    private Optional<UserDto> extractUser(String userId, String userName) {
        if (userId == null) {
            return Optional.empty();
        }
        return Optional.of(userService.getUser(userId, userName));
    }
}
