package net.erstschlag.playground.websocket;

import java.util.HashMap;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.eve.gamelog.events.GamelogEvent;
import net.erstschlag.playground.twitch.pubsub.events.ChannelBitsEvent;
import net.erstschlag.playground.twitch.pubsub.events.ChannelGiftedSubscriptionsEvent;
import net.erstschlag.playground.twitch.pubsub.events.ChannelSubscribeEvent;
import net.erstschlag.playground.twitch.pubsub.events.ChatMessageEvent;
import net.erstschlag.playground.twitch.pubsub.events.PurchaseEvent;
import net.erstschlag.playground.twitch.pubsub.events.RaffleEvent;
import net.erstschlag.playground.twitch.pubsub.events.RewardRedeemedEvent;
import net.erstschlag.playground.twitch.pubsub.events.RigEvent;
import net.erstschlag.playground.user.events.UserAwardedEvent;
import net.erstschlag.playground.user.events.UserChargedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class EventRelay {

    private final SimpMessagingTemplate webSocket;
    private final HashMap<Class, String> classTopicLookup = new HashMap<>();

    @Autowired
    public EventRelay(SimpMessagingTemplate webSocket) {
        this.webSocket = webSocket;
        classTopicLookup.put(RewardRedeemedEvent.class, "/topic/twitchRewardRedeemed");
        classTopicLookup.put(ChannelBitsEvent.class,"/topic/twitchBitsReceived");
        classTopicLookup.put(RigEvent.class,"/topic/riggingRequested");
        classTopicLookup.put(UserChargedEvent.class,"/topic/userCharged");
        classTopicLookup.put(UserAwardedEvent.class,"/topic/userAwarded");
        classTopicLookup.put(RaffleEvent.class,"/topic/raffleEntered");
        classTopicLookup.put(ChatMessageEvent.class,"/topic/chatMessageReceived");
        classTopicLookup.put(PurchaseEvent.class,"/topic/purchaseReceived");
        classTopicLookup.put(ChannelSubscribeEvent.class, "/topic/twitchSubReceived");
        classTopicLookup.put(ChannelGiftedSubscriptionsEvent.class, "/topic/twitchSubGiftsReceived");
        classTopicLookup.put(GamelogEvent.class, "/topic/gamelogReceived");
    }

    @EventListener
    public void eventReceived(PlaygroundEvent<?> event) {
        String topic = classTopicLookup.get(event.getClass());
        if (topic != null) {
            webSocket.convertAndSend(topic, event);
        }
    }
}
