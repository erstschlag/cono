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
        webSocket.convertAndSend("/topic/twitchRewardRedemptions", twitchEvent);
    }
    
    @EventListener
    public void bitsReceived(ChannelBitsEvent twitchEvent) {
        webSocket.convertAndSend("/topic/twitchBitsReceived", twitchEvent);
    }
    
    @EventListener
    public void boardAction(RewardRedeemedEvent twitchEvent) {
        webSocket.convertAndSend("/topic/object", "{\"cmd\":\"chaosBoardAction\", \"action\":\"" + twitchEvent.getTitle() + "\"}");
    }

    @EventListener
    public void bitsEvent(ChannelBitsEvent twitchEvent) {
        webSocket.convertAndSend("/topic/object", "{\"cmd\":\"guess\", \"number\":" + twitchEvent.getBitsUsed() + "}");
    }

    @EventListener(condition = "#twitchEvent.title eq 'Wiggle your back'")
    public void wiggleEvent(RewardRedeemedEvent twitchEvent) {
        String user = "anonymous";
        if (twitchEvent.getUser().isPresent()) {
            user = twitchEvent.getUser().get().getName();
        }
        webSocket.convertAndSend("/topic/object", "{\"cmd\":\"wiggle\", \"change\":1, \"userName\":\"" + user + "\"}");
    }

    @EventListener(condition = "#twitchEvent.title eq 'RaidVote'")
    public void raidVote(RewardRedeemedEvent twitchEvent) {
        String user = "anonymous";
        if (twitchEvent.getUser().isPresent()) {
            user = twitchEvent.getUser().get().getName();
        }
        int amount = 1;
        if(twitchEvent.getUser().isPresent() && twitchEvent.getUser().get().getShillings() > 0) {
            amount = 2;
        }
        String userInput = twitchEvent.getUserInput();
        if (userInput.matches("[A-Za-z0-9_]{3,25}")) {
            webSocket.convertAndSend("/topic/object", "{\"cmd\":\"raidVote\", \"channelName\":\"" + userInput.toLowerCase() + "\", \"amount\": " + amount + ", \"userName\":\"" + user + "\"}");
        }
    }
}
