package net.erstschlag.playground.twitch.pubsub;

import com.github.philippheuer.credentialmanager.domain.OAuth2Credential;
import com.github.philippheuer.events4j.core.domain.Event;
import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.TwitchClientBuilder;
import com.github.twitch4j.chat.events.channel.ChannelMessageEvent;
import com.github.twitch4j.pubsub.events.ChannelBitsEvent;
import com.github.twitch4j.pubsub.events.ChannelSubscribeEvent;
import com.github.twitch4j.pubsub.events.RewardRedeemedEvent;
import net.erstschlag.playground.twitch.user.UserDto;
import net.erstschlag.playground.twitch.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class PubSubService {

    private final ApplicationEventPublisher applicationEventPublisher;
    private final PubSubConfiguration pubSubConfiguration;
    private final UserService userService;
    private final Twitch4JEventWrapper twitch4JEventWrapper;
    private TwitchClient twitchClient;

    @Autowired
    public PubSubService(ApplicationEventPublisher applicationEventPublisher, PubSubConfiguration pubSubConfiguration, UserService userService, Twitch4JEventWrapper twitch4JEventWrapper) {
        this.applicationEventPublisher = applicationEventPublisher;
        this.pubSubConfiguration = pubSubConfiguration;
        this.userService = userService;
        this.twitch4JEventWrapper = twitch4JEventWrapper;
    }

    public final synchronized void initialize(String oAuthToken) {
        shutdownTwitchClient();
        OAuth2Credential oAuth = new OAuth2Credential("twitch", oAuthToken);
        OAuth2Credential oAuthChat = new OAuth2Credential("twitch", pubSubConfiguration.getChatBotOAuthToken());
        twitchClient = TwitchClientBuilder.builder().withEnableChat(true).withChatAccount(oAuthChat).withEnablePubSub(true).build();
        twitchClient.getPubSub().listenForChannelPointsRedemptionEvents(oAuth, pubSubConfiguration.getChannelId());
        twitchClient.getPubSub().listenForCheerEvents(oAuth, pubSubConfiguration.getChannelId());
        twitchClient.getPubSub().listenForSubscriptionEvents(oAuth, pubSubConfiguration.getChannelId());
        twitchClient.getPubSub().getEventManager().onEvent(RewardRedeemedEvent.class, event -> publishApplicationEvent(twitch4JEventWrapper.wrap(event)));
        twitchClient.getPubSub().getEventManager().onEvent(ChannelBitsEvent.class, event -> bitsReceived(publishApplicationEvent(twitch4JEventWrapper.wrap(event))));
        twitchClient.getPubSub().getEventManager().onEvent(ChannelSubscribeEvent.class, event -> subscriptionReceived(publishApplicationEvent(twitch4JEventWrapper.wrap(event))));
        twitchClient.getChat().joinChannel(pubSubConfiguration.getChannelName());
        twitchClient.getChat().getEventManager().onEvent(ChannelMessageEvent.class, event -> chatMessageReceived(publishApplicationEvent(twitch4JEventWrapper.wrap(event))));
    }
    
    private <T extends Event> T publishApplicationEvent(TwitchEvent<T> twitchEvent) {
        applicationEventPublisher.publishEvent(twitchEvent);
        return twitchEvent.getEvent();
    }

    private void shutdownTwitchClient() {
        if (twitchClient != null) {
            try {
                twitchClient.close();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                twitchClient = null;
            }
        }
    }

    private void subscriptionReceived(ChannelSubscribeEvent event) {
        if (event.getData().getUserId() != null) {
            userService.handleSubEvent(event);
        }
    }

    private void bitsReceived(ChannelBitsEvent event) {
        userService.handleBitsEvent(event);
    }

    private void chatMessageReceived(ChannelMessageEvent event) {
        if (event.getMessage() != null && event.getMessage().toLowerCase().startsWith("!shilling")) {
            UserDto user = userService.getUser(event.getUser().getId(), event.getUser().getName());
            twitchClient.getChat().sendMessage(pubSubConfiguration.getChannelName(), "You currently own " + user.getShillings() + " shillings!", "", event.getMessageEvent().getMessageId().get());
        }
    }

}
