package net.erstschlag.playground.games.board.generic;

import java.util.HashMap;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.twitch.pubsub.ChannelBitsEvent;
import net.erstschlag.playground.twitch.pubsub.ChatMessageEvent;
import net.erstschlag.playground.twitch.pubsub.PurchaseEvent;
import net.erstschlag.playground.twitch.pubsub.RaffleEvent;
import net.erstschlag.playground.twitch.pubsub.RewardRedeemedEvent;
import net.erstschlag.playground.twitch.pubsub.RigEvent;
import net.erstschlag.playground.user.UserAwardedEvent;
import net.erstschlag.playground.user.UserChargedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class GenericBoardService {

    private final SimpMessagingTemplate webSocket;
    private final HashMap<Class, String> classTopicLookup = new HashMap<>();

    @Autowired
    public GenericBoardService(SimpMessagingTemplate webSocket) {
        this.webSocket = webSocket;
        classTopicLookup.put(RewardRedeemedEvent.class, "/topic/twitchRewardRedeemed");
        classTopicLookup.put(ChannelBitsEvent.class,"/topic/twitchBitsReceived");
        classTopicLookup.put(RigEvent.class,"/topic/riggingRequested");
        classTopicLookup.put(UserChargedEvent.class,"/topic/userCharged");
        classTopicLookup.put(UserAwardedEvent.class,"/topic/userAwarded");
        classTopicLookup.put(RaffleEvent.class,"/topic/raffleEntered");
        classTopicLookup.put(ChatMessageEvent.class,"/topic/chatMessageReceived");
        classTopicLookup.put(PurchaseEvent.class,"/topic/purchaseReceived");
    }

    @EventListener
    public void eventReceived(PlaygroundEvent<?> event) {
        String topic = classTopicLookup.get(event.getClass());
        if (topic != null) {
            webSocket.convertAndSend(topic, event);
        }
    }
}
