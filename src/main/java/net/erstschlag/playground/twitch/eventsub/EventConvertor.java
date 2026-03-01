package net.erstschlag.playground.twitch.eventsub;

import java.util.Optional;
import net.erstschlag.playground.twitch.eventsub.events.ChannelBitsEvent;
import net.erstschlag.playground.twitch.eventsub.events.ChannelGiftedSubscriptionsEvent;
import net.erstschlag.playground.twitch.eventsub.events.ChannelMessageEvent;
import net.erstschlag.playground.twitch.eventsub.events.ChannelPollEvent;
import net.erstschlag.playground.twitch.eventsub.events.ChannelSubscribeEvent;
import net.erstschlag.playground.twitch.eventsub.events.RewardRedeemedEvent;
import net.erstschlag.playground.user.UserDto;
import net.erstschlag.playground.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EventConvertor {

    private final UserService userService;

    @Autowired
    public EventConvertor(UserService userService) {
        this.userService = userService;
    }

    public RewardRedeemedEvent convert(com.github.twitch4j.eventsub.events.ChannelPointsCustomRewardRedemptionEvent cPCRRE) {
        System.out.println(cPCRRE.toString());
        return new RewardRedeemedEvent(extractUser(cPCRRE),
                cPCRRE.getReward().getTitle(),
                cPCRRE.getUserInput(),
                cPCRRE.getReward().getCost());
    }

    public ChannelBitsEvent convert(com.github.twitch4j.eventsub.events.ChannelCheerEvent cCE) {
        System.out.println(cCE.toString());
        return new ChannelBitsEvent(extractUser(cCE),
                cCE.getBits(),
                cCE.getMessage()
        );
    }

    public ChannelBitsEvent convertToBitsEvent(com.github.twitch4j.eventsub.events.ChannelChatMessageEvent cCME) {
        System.out.println(cCME.toString());
        assert (cCME.getCheer() != null);
        return new ChannelBitsEvent(extractUser(cCME),
                cCME.getCheer().getBits(),
                cCME.getMessage() != null ? cCME.getMessage().getText() : null
        );
    }

    public ChannelSubscribeEvent convert(com.github.twitch4j.eventsub.events.ChannelSubscriptionMessageEvent cSME) {
        System.out.println(cSME.toString());
        return new ChannelSubscribeEvent(extractUser(cSME),
                false,
                SubTier.fromSubPlan(cSME.getTier()));
    }

    public ChannelSubscribeEvent convert(com.github.twitch4j.eventsub.events.ChannelSubscribeEvent cSE) {
        System.out.println(cSE.toString());
        return new ChannelSubscribeEvent(extractUser(cSE),
                false,
                SubTier.fromSubPlan(cSE.getTier()));
    }

    public ChannelGiftedSubscriptionsEvent convert(com.github.twitch4j.eventsub.events.ChannelSubscriptionGiftEvent cSGE) {
        System.out.println(cSGE.toString());
        return new ChannelGiftedSubscriptionsEvent(extractUser(cSGE),
                SubTier.fromSubPlan(cSGE.getTier()),
                cSGE.getTotal());
    }

    public ChannelMessageEvent convert(com.github.twitch4j.eventsub.events.ChannelChatMessageEvent cCME) {
        System.out.println(cCME.toString());
        assert (cCME.getCheer() == null);
        return new ChannelMessageEvent(extractUser(cCME),
                cCME.getMessage().getText(),//TODO: sanitize
                Optional.ofNullable(cCME.getMessageId())
        );
    }
    
    public ChannelPollEvent convert(com.github.twitch4j.eventsub.events.ChannelPollBeginEvent cPBE){
        System.out.println(cPBE.toString());
        return null;
    }
    
    public ChannelPollEvent convert(com.github.twitch4j.eventsub.events.ChannelPollProgressEvent cPPE){
        System.out.println(cPPE.toString());
        return null;
    }
    
    public ChannelPollEvent convert(com.github.twitch4j.eventsub.events.ChannelPollEndEvent cPEE){
        System.out.println(cPEE.toString());
        return null;
    }
    
    private Optional<UserDto> extractUser(com.github.twitch4j.eventsub.events.EventSubUserChannelEvent eSUCE) {
        if (eSUCE.getUserId() == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(userService.getOrCreateUser(eSUCE.getUserId(), eSUCE.getUserLogin()));
    }

    private Optional<UserDto> extractUser(com.github.twitch4j.eventsub.events.ChannelChatUserEvent cCUE) {
        if (cCUE.getChatterUserId() == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(userService.getOrCreateUser(cCUE.getChatterUserId(), cCUE.getChatterUserLogin()));
    }
}
