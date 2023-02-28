package net.erstschlag.playground.games.board.generic;

import net.erstschlag.playground.twitch.pubsub.ChannelBitsEvent;
import net.erstschlag.playground.twitch.pubsub.RewardRedeemedEvent;
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

}
