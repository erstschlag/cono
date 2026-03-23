package net.erstschlag.playground.twitch.eventsub;

import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.twitch.eventsub.events.*;
import com.github.philippheuer.credentialmanager.domain.OAuth2Credential;
import com.github.twitch4j.TwitchClient;
import com.github.twitch4j.TwitchClientBuilder;
import com.github.twitch4j.eventsub.subscriptions.SubscriptionTypes;
import com.github.twitch4j.helix.domain.ChattersList;
import com.github.twitch4j.helix.domain.Stream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.StringTokenizer;
import net.erstschlag.playground.user.events.UserAwardedEvent;
import net.erstschlag.playground.user.events.UserChargedEvent;
import net.erstschlag.playground.user.UserCreditsService;
import net.erstschlag.playground.user.UserDto;
import net.erstschlag.playground.user.UserService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class EventSubService {

    private final ApplicationEventPublisher applicationEventPublisher;
    private final EventSubConfiguration eventSubConfiguration;
    private final UserService userService;
    private final UserCreditsService userCreditsService;
    private final EventConvertor eventConvertor;
    private final EventSubOAuth eventSubOAuth;
    private TwitchClient twitchClient = null;
    private TwitchOAuthDto twitchOAuthDto = null;

    public EventSubService(ApplicationEventPublisher applicationEventPublisher,
            EventSubConfiguration eventSubConfiguration,
            UserService userService,
            UserCreditsService userCreditsService,
            EventConvertor eventConvertor,
            EventSubOAuth eventSubOAuth) {
        this.applicationEventPublisher = applicationEventPublisher;
        this.eventSubConfiguration = eventSubConfiguration;
        this.userService = userService;
        this.userCreditsService = userCreditsService;
        this.eventConvertor = eventConvertor;
        this.eventSubOAuth = eventSubOAuth;
    }

    public final void authenticate(String code) throws IOException, InterruptedException {
        twitchOAuthDto = eventSubOAuth.authenticate(code);
        initialize();
    }

    public final synchronized void initialize() {
        shutdownTwitchClient();
        OAuth2Credential oAuthCredential = new OAuth2Credential("twitch", twitchOAuthDto.getToken());
        OAuth2Credential oAuthChatCredential = new OAuth2Credential("twitch", eventSubConfiguration.getChatBotOAuthToken());
        twitchClient = TwitchClientBuilder.builder().withEnableEventSocket(true).withEnableHelix(true).withEnableChat(true).withChatAccount(oAuthChatCredential).withDefaultAuthToken(oAuthCredential).build();
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.CHANNEL_POINTS_CUSTOM_REWARD_REDEMPTION_ADD.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId()).build(),
                        null
                )
        );
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelPointsCustomRewardRedemptionEvent.class, event -> publishApplicationEvent(eventConvertor.convert(event)));
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.CHANNEL_SUBSCRIPTION_MESSAGE.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId()).build(),
                        null
                )
        );
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelSubscriptionMessageEvent.class, event -> subscriptionReceived(publishApplicationEvent(eventConvertor.convert(event))));
        
        /*
        twitchClient.getEventSocket().register(
                SubscriptionTypes.CHANNEL_SUBSCRIBE.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId()).build(),
                        null
                )
        );*/
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelSubscribeEvent.class, event -> subscriptionReceived(publishApplicationEvent(eventConvertor.convert(event))));
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.CHANNEL_SUBSCRIPTION_GIFT.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId()).build(),
                        null
                )
        );
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelSubscriptionGiftEvent.class, event -> giftedSubscriptionsReceived(publishApplicationEvent(eventConvertor.convert(event))));
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.CHANNEL_CHEER.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId()).build(),
                        null
                )
        );
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.CHANNEL_CHAT_MESSAGE.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId())
                                .userId(eventSubConfiguration.getChannelId()).build(),
                        null
                )
        );
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelChatMessageEvent.class, event -> handleChannelChatMessageEvent(event));
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.CHANNEL_CHAT_NOTIFICATION.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId())
                                .userId(eventSubConfiguration.getChannelId()).build(),
                        null
                )
        );
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelChatNotificationEvent.class, event -> handleChannelNotificationMessageEvent(event));
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.POLL_BEGIN.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId())
                                .build(),
                        null
                )
        );
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelPollBeginEvent.class, event -> eventConvertor.convert(event));
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.POLL_PROGRESS.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId())
                                .build(),
                        null
                )
        );
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelPollProgressEvent.class, event -> eventConvertor.convert(event));
        
        twitchClient.getEventSocket().register(
                SubscriptionTypes.POLL_END.prepareSubscription(
                        builder -> builder.broadcasterUserId(eventSubConfiguration.getChannelId())
                                .build(),
                        null
                )
        );
        twitchClient.getEventManager().onEvent(com.github.twitch4j.eventsub.events.ChannelPollEndEvent.class, event -> eventConvertor.convert(event));
        
        twitchClient.getChat().joinChannel(eventSubConfiguration.getChannelName());
    }

    @Scheduled(initialDelay = 7200000, fixedRate = 7200000)
    public void refreshTwitchAuthentication() throws IOException, InterruptedException {
        if (twitchOAuthDto != null) {
            twitchOAuthDto = eventSubOAuth.refresh(twitchOAuthDto);
            initialize();
        }
    }
    
    @Scheduled(initialDelay = 30000, fixedRate = 60000)
    public void refreshViewerCount() {
        if (twitchClient != null) {
            List<String> userIds = new ArrayList<>();
            userIds.add(eventSubConfiguration.getChannelId());
            List<Stream> streams = twitchClient.getHelix().getStreams(twitchOAuthDto.getToken(), null, null, 1, null, null, userIds, null).execute().getStreams();
            int viewers = 0;
            if (!streams.isEmpty() && "live".equals(streams.get(0).getType())) {
                viewers = streams.get(0).getViewerCount();
            }
            publishApplicationEvent(new ChannelViewershipEvent(viewers, getChatters().size()));
        }
    }

    public List<String> getChatters() {
        List<String> result = new ArrayList<>();
        if (this.twitchClient != null) {
            ChattersList chattersList;
            String cursor = null;
            do {
                chattersList = twitchClient.getHelix()
                        .getChatters(twitchOAuthDto.getToken(), eventSubConfiguration.getChannelId(), eventSubConfiguration.getChannelId(), 500, cursor)
                        .execute();
                chattersList.getChatters().forEach(chatter -> {
                    result.add(chatter.getUserLogin());
                });
                cursor = chattersList.getPagination().getCursor();
            } while (cursor != null);
        }
        return result;
    }

    private <T extends PlaygroundEvent> T publishApplicationEvent(T twitchEvent) {
        applicationEventPublisher.publishEvent(twitchEvent);
        System.out.println(twitchEvent.toString());
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

    private void handleChannelNotificationMessageEvent(com.github.twitch4j.eventsub.events.ChannelChatNotificationEvent cCNE) {
        if (cCNE.getSourceBroadcasterUserId() == null || eventSubConfiguration.getChannelId().equals(cCNE.getSourceBroadcasterUserId())) {
            System.out.println("NOTIFICATION:type=" + cCNE.getNoticeType().toString() + ", message=" + cCNE.getMessage().getText());
        }
    }
    
    private void handleChannelChatMessageEvent(com.github.twitch4j.eventsub.events.ChannelChatMessageEvent cCME) {
        if (cCME.getSourceBroadcasterUserId() == null || eventSubConfiguration.getChannelId().equals(cCME.getSourceBroadcasterUserId())) {
            switch (cCME.getMessageType()) {
                case POWER_UPS_GIGANTIFIED_EMOTE ->  {
                    bitsReceived(new ChannelBitsEvent(extractUser(cCME), 30, cCME.getMessage().getText()));
                }
                case POWER_UPS_MESSAGE_EFFECT ->  {
                    bitsReceived(new ChannelBitsEvent(extractUser(cCME), 20, cCME.getMessage().getText()));
                }
                default ->  {
                    if (cCME.getCheer() != null) {
                        bitsReceived(eventConvertor.convertToBitsEvent(cCME));
                    } else {
                        chatMessageReceived(eventConvertor.convert(cCME));
                    }
                }
            }
        }
    }

    private void subscriptionReceived(ChannelSubscribeEvent event) {
        if (event.getUser().isPresent()) {
            userCreditsService.handleSubEvent(event);
        }
    }

    private void giftedSubscriptionsReceived(ChannelGiftedSubscriptionsEvent event) {
        if (event.getUser().isPresent()) {
            userCreditsService.handleGiftedSubsEvent(event);
        }
    }

    private void bitsReceived(ChannelBitsEvent event) {
        publishApplicationEvent(event);
        userCreditsService.handleBitsEvent(event);
    }

    private void chatMessageReceived(ChannelMessageEvent event) {
        String eventMessage = event.getMessage();
        if (eventMessage != null) {
            if (eventMessage.startsWith("!nuggets")) {
                handleNuggetChatMessage(event);
                return;
            }
            if (eventMessage.startsWith("!lp")) {
                handleLPChatMessage(event);
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
            if (eventMessage.startsWith("!spend")) {
                handleSpendChatMessage(event);
                return;
            }
            handleChatMessage(event, eventMessage);
        }
    }

    private void handleChatMessage(ChannelMessageEvent event, String message) {
        publishApplicationEvent(new ChatMessageEvent(event.getUser(), message));
    }

    private void handleSpendChatMessage(ChannelMessageEvent event) {
        StringTokenizer strTok = new StringTokenizer(event.getMessage(), " ");
        if (strTok.countTokens() >= 4) {
            strTok.nextToken();
            String consumer = strTok.nextToken();
            String command = strTok.nextToken();
            Integer amount = Integer.valueOf(strTok.nextToken());
            publishApplicationEvent(new PurchaseEvent(event.getUser(), consumer, command, amount));
        }
    }

    private void handleNuggetChatMessage(ChannelMessageEvent event) {
        twitchClient.getChat().sendMessage(eventSubConfiguration.getChannelName(), "You currently own " + event.getUser().get().getNuggets() + " nuggets!", "", event.getMessageId().get());
    }

    private void handleLPChatMessage(ChannelMessageEvent event) {
        Integer rank = userService.getUserWeeklyLPRank(event.getUser().get().getId());
        twitchClient.getChat().sendMessage(eventSubConfiguration.getChannelName(), "You currently have " + event.getUser().get().getWeeklyLP() + " weekly LP, which puts you at rank " + rank + "!", "", event.getMessageId().get());
    }

    private void handleRigChatMessage(ChannelMessageEvent event) {
        StringTokenizer strTok = new StringTokenizer(event.getMessage(), " ");
        if (strTok.countTokens() >= 2) {
            strTok.nextToken();
            publishApplicationEvent(new RigEvent(event.getUser(), strTok.nextToken(), tokensToCommandString(strTok)));
        }
    }

    private void handleRaffleChatMessage(ChannelMessageEvent event) {
        Optional<String> raffleArg1 = Optional.empty();
        StringTokenizer strTok = new StringTokenizer(event.getMessage(), " ");
        if (strTok.countTokens() >= 2) {
            strTok.nextToken();
            raffleArg1 = Optional.of(strTok.nextToken());
        }
        publishApplicationEvent(new RaffleEvent(event.getUser(), raffleArg1));
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
        if (twitchClient == null) {
            return;
        }
        String message = "@?userName has been charged ?numberOfNuggets nuggets for ?reason";
        message = message.replace("?userName", userChargedEvent.getUser().get().getName());
        message = message.replace("?numberOfNuggets", "" + userChargedEvent.getAmount());
        message = message.replace("?reason", userChargedEvent.getReason());
        twitchClient.getChat().sendMessage(eventSubConfiguration.getChannelName(), message);
    }

    @EventListener
    public void userAwarded(UserAwardedEvent userAwardedEvent) {
        if (twitchClient == null) {
            return;
        }
        String message = "@?userName has been awarded ?numberOfNuggets nuggets for ?reason";
        message = message.replace("?userName", userAwardedEvent.getUser().get().getName());
        message = message.replace("?numberOfNuggets", "" + userAwardedEvent.getAmount());
        message = message.replace("?reason", userAwardedEvent.getReason());
        twitchClient.getChat().sendMessage(eventSubConfiguration.getChannelName(), message);
    }

    private Optional<UserDto> extractUser(com.github.twitch4j.eventsub.events.ChannelChatUserEvent cCUE) {
        if (cCUE.getChatterUserId() == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(userService.getOrCreateUser(cCUE.getChatterUserId(), cCUE.getChatterUserLogin(), cCUE.getChatterUserName()));
    }
}
