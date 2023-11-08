package net.erstschlag.playground.games.board.generic;

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

    @Autowired
    public GenericBoardService(SimpMessagingTemplate webSocket) {
        this.webSocket = webSocket;
    }

    @EventListener
    public void rewardRedeemed(RewardRedeemedEvent twitchEvent) {
        webSocket.convertAndSend("/topic/twitchRewardRedeemed", twitchEvent);
    }

    @EventListener
    public void bitsReceived(ChannelBitsEvent twitchEvent) {
        webSocket.convertAndSend("/topic/twitchBitsReceived", twitchEvent);
    }

    @EventListener
    public void riggingRequested(RigEvent rigEvent) {
        webSocket.convertAndSend("/topic/riggingRequested", rigEvent);
    }

    @EventListener
    public void userCharged(UserChargedEvent userChargedEvent) {
        webSocket.convertAndSend("/topic/userCharged", userChargedEvent);
    }

    @EventListener
    public void userAwarded(UserAwardedEvent userAwardedEvent) {
        webSocket.convertAndSend("/topic/userAwarded", userAwardedEvent);
    }

    @EventListener
    public void raffleEntered(RaffleEvent raffleEvent) {
        webSocket.convertAndSend("/topic/raffleEntered", raffleEvent);
    }

    @EventListener
    public void chatMessageReceived(ChatMessageEvent chatMessageEvent) {
        webSocket.convertAndSend("/topic/chatMessageReceived", chatMessageEvent);
    }
    
    @EventListener
    public void purchaseEventReceived(PurchaseEvent purchaseEvent) {
        webSocket.convertAndSend("/topic/purchaseReceived", purchaseEvent);
    }
}
