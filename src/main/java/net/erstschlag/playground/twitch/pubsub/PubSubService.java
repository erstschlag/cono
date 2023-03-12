package net.erstschlag.playground.twitch.pubsub;

import net.erstschlag.playground.PlaygroundEvent;
import com.github.philippheuer.credentialmanager.domain.OAuth2Credential;
import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.TwitchClientBuilder;
import java.util.StringTokenizer;
import net.erstschlag.playground.user.UserDto;
import net.erstschlag.playground.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class PubSubService {

    private final ApplicationEventPublisher applicationEventPublisher;
    private final PubSubConfiguration pubSubConfiguration;
    private final UserService userService;
    private final Twitch4JEventConvertor twitch4JEventConvertor;
    private TwitchClient twitchClient;

    @Autowired
    public PubSubService(ApplicationEventPublisher applicationEventPublisher, PubSubConfiguration pubSubConfiguration, UserService userService, Twitch4JEventConvertor twitch4JEventConvertor) {
        this.applicationEventPublisher = applicationEventPublisher;
        this.pubSubConfiguration = pubSubConfiguration;
        this.userService = userService;
        this.twitch4JEventConvertor = twitch4JEventConvertor;
    }

    public final synchronized void initialize(String oAuthToken) {
        shutdownTwitchClient();
        OAuth2Credential oAuth = new OAuth2Credential("twitch", oAuthToken);
        OAuth2Credential oAuthChat = new OAuth2Credential("twitch", pubSubConfiguration.getChatBotOAuthToken());
        twitchClient = TwitchClientBuilder.builder().withEnableChat(true).withChatAccount(oAuthChat).withEnablePubSub(true).build();
        twitchClient.getPubSub().listenForChannelPointsRedemptionEvents(oAuth, pubSubConfiguration.getChannelId());
        twitchClient.getPubSub().listenForCheerEvents(oAuth, pubSubConfiguration.getChannelId());
        twitchClient.getPubSub().listenForSubscriptionEvents(oAuth, pubSubConfiguration.getChannelId());
        twitchClient.getPubSub().getEventManager().onEvent(com.github.twitch4j.pubsub.events.RewardRedeemedEvent.class, event -> publishApplicationEvent(twitch4JEventConvertor.convert(event)));
        twitchClient.getPubSub().getEventManager().onEvent(com.github.twitch4j.pubsub.events.ChannelBitsEvent.class, event -> bitsReceived(publishApplicationEvent(twitch4JEventConvertor.convert(event))));
        twitchClient.getPubSub().getEventManager().onEvent(com.github.twitch4j.pubsub.events.ChannelSubscribeEvent.class, event -> subscriptionReceived(publishApplicationEvent(twitch4JEventConvertor.convert(event))));
        twitchClient.getChat().joinChannel(pubSubConfiguration.getChannelName());
        twitchClient.getChat().getEventManager().onEvent(com.github.twitch4j.chat.events.channel.ChannelMessageEvent.class, event -> chatMessageReceived(publishApplicationEvent(twitch4JEventConvertor.convert(event))));
    }

    private <T extends PlaygroundEvent> T publishApplicationEvent(T twitchEvent) {
        applicationEventPublisher.publishEvent(twitchEvent);
        return twitchEvent;
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
        if (event.getUser().isPresent()) {
            userService.handleSubEvent(event);
        }
    }

    private void bitsReceived(ChannelBitsEvent event) {
        userService.handleBitsEvent(event);
    }

    private void chatMessageReceived(ChannelMessageEvent event) {
        String eventMessage = event.getMessage();
        if (eventMessage != null) {
            if (eventMessage.startsWith("!nuggets")) {
                handleNuggetChatMessage(event);
            }
            if (eventMessage.startsWith("!rig")) {
                handleRigChatMessage(event);
            }
        }
    }

    private void handleNuggetChatMessage(ChannelMessageEvent event) {
        UserDto user = userService.getOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
        twitchClient.getChat().sendMessage(pubSubConfiguration.getChannelName(), "You currently own " + user.getNuggets() + " nuggets!", "", event.getMessageId().get());
    }

    private void handleRigChatMessage(ChannelMessageEvent event) {
        StringTokenizer strTok = new StringTokenizer(event.getMessage(), " ");
        if (strTok.countTokens() == 2) {
            strTok.nextToken();
            UserDto user = userService.getOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
            publishApplicationEvent(new RigEvent(user, strTok.nextToken()));
        }
    }

}
