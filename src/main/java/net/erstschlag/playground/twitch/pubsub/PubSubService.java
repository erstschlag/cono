package net.erstschlag.playground.twitch.pubsub;

import net.erstschlag.playground.PlaygroundEvent;
import com.github.philippheuer.credentialmanager.domain.OAuth2Credential;
import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.TwitchClientBuilder;
import java.util.StringTokenizer;
import net.erstschlag.playground.user.UserChargedEvent;
import net.erstschlag.playground.user.UserDto;
import net.erstschlag.playground.user.UserService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
public class PubSubService {

    private final ApplicationEventPublisher applicationEventPublisher;
    private final PubSubConfiguration pubSubConfiguration;
    private final UserService userService;
    private final Twitch4JEventConvertor twitch4JEventConvertor;
    private TwitchClient twitchClient;

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
                return;
            }
            if (eventMessage.startsWith("!rig")) {
                handleRigChatMessage(event);
                return;
            }
            if (eventMessage.startsWith("!raffle")) {
                handleRaffleChatMessage(event);
                return;
            }
            if(eventMessage.startsWith("!spend")) {
                handleSpendChatMessage(event);
                return;
            }
            handleChatMessage(event, eventMessage);
        }
    }

    private void handleChatMessage(ChannelMessageEvent event, String message) {
        UserDto user = userService.getOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
        publishApplicationEvent(new ChatMessageEvent(user, message));
    }

    private void handleSpendChatMessage(ChannelMessageEvent event) {
        StringTokenizer strTok = new StringTokenizer(event.getMessage(), " ");
        if (strTok.countTokens() >= 4) {
            strTok.nextToken();
            UserDto user = userService.getOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
            String consumer = strTok.nextToken();
            String command = strTok.nextToken();
            Integer amount = Integer.valueOf(strTok.nextToken());
            publishApplicationEvent(new PurchaseEvent(user, consumer, command, amount));
        }
    }
    
    private void handleNuggetChatMessage(ChannelMessageEvent event) {
        UserDto user = userService.getOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
        twitchClient.getChat().sendMessage(pubSubConfiguration.getChannelName(), "You currently own " + user.getNuggets() + " nuggets!", "", event.getMessageId().get());
    }

    private void handleRigChatMessage(ChannelMessageEvent event) {
        StringTokenizer strTok = new StringTokenizer(event.getMessage(), " ");
        if (strTok.countTokens() >= 2) {
            strTok.nextToken();
            UserDto user = userService.getOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
            publishApplicationEvent(new RigEvent(user, strTok.nextToken(), tokensToCommandString(strTok)));
        }
    }

    private void handleRaffleChatMessage(ChannelMessageEvent event) {
        UserDto user = userService.getOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
        publishApplicationEvent(new RaffleEvent(user));
    }

    private String tokensToCommandString(StringTokenizer remainingTokens) {
        StringBuilder commandStrBuff = new StringBuilder();
        boolean isFirstToken = true;
        while (remainingTokens.hasMoreTokens()) {
            if (!isFirstToken) {
                commandStrBuff.append(" ");
            }
            commandStrBuff.append(remainingTokens.nextToken());
            isFirstToken = false;
        }
        return commandStrBuff.toString();
    }

    @EventListener
    public void userCharged(UserChargedEvent userChargedEvent) {
        String message = "@?userName has been charged ?numberOfNuggets nuggets for ?reason";
        message = message.replace("?userName", userChargedEvent.getUser().get().getName());
        message = message.replace("?numberOfNuggets", "" + userChargedEvent.getAmount());
        message = message.replace("?reason", userChargedEvent.getReason());
        twitchClient.getChat().sendMessage(pubSubConfiguration.getChannelName(), message);
    }

}
