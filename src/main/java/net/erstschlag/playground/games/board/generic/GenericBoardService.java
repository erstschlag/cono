package net.erstschlag.playground.games.board.generic;

import com.github.twitch4j.pubsub.events.ChannelBitsEvent;
import com.github.twitch4j.pubsub.events.RewardRedeemedEvent;
import net.erstschlag.playground.twitch.pubsub.TwitchEvent;
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
    public void boardAction(TwitchEvent<RewardRedeemedEvent> twitchEvent) {
        webSocket.convertAndSend("/topic/object", "{\"cmd\":\"chaosBoardAction\", \"action\":\"" + twitchEvent.getEvent().getRedemption().getReward().getTitle() + "\"}");
    }

    @EventListener
    public void bitsEvent(TwitchEvent<ChannelBitsEvent> twitchEvent) {
        webSocket.convertAndSend("/topic/object", "{\"cmd\":\"progress\", \"progressChange\":" + twitchEvent.getEvent().getData().getBitsUsed() + "}");
        webSocket.convertAndSend("/topic/object", "{\"cmd\":\"guess\", \"number\":" + twitchEvent.getEvent().getData().getBitsUsed() + "}");
    }

    @EventListener(condition = "#twitchEvent.event.redemption.reward.title eq 'Wiggle your back'")
    public void wiggleEvent(TwitchEvent<RewardRedeemedEvent> twitchEvent) {
        String user = "anonymous";
        if (twitchEvent.getUser().isPresent()) {
            user = twitchEvent.getUser().get().getName();
        }
        webSocket.convertAndSend("/topic/object", "{\"cmd\":\"wiggle\", \"change\":1, \"userName\":\"" + user + "\"}");
    }

    @EventListener(condition = "#twitchEvent.event.redemption.reward.title eq 'Charge!'")
    public void chargeEvent(TwitchEvent<RewardRedeemedEvent> twitchEvent) {
        webSocket.convertAndSend("/topic/object", "{\"cmd\":\"progress\", \"progressChange\":" + 10 + "}");
    }

    @EventListener(condition = "#twitchEvent.event.redemption.reward.title eq 'RaidVote'")
    public void raidVote(TwitchEvent<RewardRedeemedEvent> twitchEvent) {
        String user = "anonymous";
        if (twitchEvent.getUser().isPresent()) {
            user = twitchEvent.getUser().get().getName();
        }
        int amount = 1;
        if(twitchEvent.getUser().isPresent() && twitchEvent.getUser().get().getShillings() > 0) {
            amount = 2;
        }
        String userInput = twitchEvent.getEvent().getRedemption().getUserInput();
        if (userInput.matches("[A-Za-z0-9_]{3,25}")) {
            webSocket.convertAndSend("/topic/object", "{\"cmd\":\"raidVote\", \"channelName\":\"" + userInput.toLowerCase() + "\", \"amount\": " + amount + ", \"userName\":\"" + user + "\"}");
        }
    }
}
