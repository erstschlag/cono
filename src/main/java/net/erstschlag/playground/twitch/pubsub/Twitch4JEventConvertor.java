package net.erstschlag.playground.twitch.pubsub;

import net.erstschlag.playground.twitch.pubsub.events.*;
import java.util.Optional;
import net.erstschlag.playground.user.UserDto;
import net.erstschlag.playground.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Twitch4JEventConvertor {

    private final UserService userService;

    @Autowired
    public Twitch4JEventConvertor(UserService userService) {
        this.userService = userService;
    }

    public RewardRedeemedEvent convert(com.github.twitch4j.pubsub.events.RewardRedeemedEvent rRE) {
        return new RewardRedeemedEvent(extractUser(
                rRE.getRedemption().getUser().getId(),
                rRE.getRedemption().getUser().getLogin()
        ), 
                rRE.getRedemption().getReward().getTitle(), 
                rRE.getRedemption().getUserInput(), 
                rRE.getRedemption().getReward().getCost());
    }

    public ChannelBitsEvent convert(com.github.twitch4j.pubsub.events.ChannelBitsEvent cBE) {
        return new ChannelBitsEvent(extractUser(
                cBE.getData().getUserId(),
                cBE.getData().getUserName()
        ), 
                cBE.getData().getBitsUsed());
    }

    public ChannelSubscribeEvent convert(com.github.twitch4j.pubsub.events.ChannelSubscribeEvent cSE) {
        Optional<UserDto> oUser;
        if (cSE.getData().getIsGift()) {
            oUser = extractUser(cSE.getData().getRecipientId(),
                    cSE.getData().getRecipientUserName());
        } else {
            oUser = extractUser(cSE.getData().getUserId(),
                    cSE.getData().getUserName());
        }
        return new ChannelSubscribeEvent(oUser, 
                cSE.getData().getIsGift(), 
                SubTier.fromSubPlan(cSE.getData().getSubPlan()));
    }
    
    public ChannelGiftedSubscriptionsEvent convert(com.github.twitch4j.chat.events.channel.GiftSubscriptionsEvent cSGE) {
        return new ChannelGiftedSubscriptionsEvent(extractUser(
                cSGE.getUser().getId(),
                cSGE.getUser().getName()
        ),
                SubTier.fromSubPlanString(cSGE.getSubscriptionPlan()),
                cSGE.getCount());
    }

    public ChannelMessageEvent convert(com.github.twitch4j.chat.events.channel.ChannelMessageEvent cME) {
        return new ChannelMessageEvent(extractUser(
                cME.getUser().getId(),
                cME.getUser().getName()
        ),
                cME.getMessage(),//TODO: sanitize
                cME.getMessageEvent().getMessageId()
        );
    }

    private Optional<UserDto> extractUser(String userId, String userName) {
        if (userId == null) {
            return Optional.empty();
        }
        return Optional.of(userService.getOrCreateUser(userId, userName));
    }
}
