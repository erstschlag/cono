package net.erstschlag.playground.twitch.pubsub.client;

import java.io.IOException;
import net.erstschlag.playground.twitch.pubsub.PubSubService;
import net.erstschlag.playground.twitch.pubsub.PubSubConfiguration;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class OAuthController {

    private final PubSubService pubSubService;
    private final PubSubConfiguration pubSubConfiguration;

    public OAuthController(PubSubService pubSubService, PubSubConfiguration pubSubConfiguration) {
        this.pubSubService = pubSubService;
        this.pubSubConfiguration = pubSubConfiguration;
    }

    @MessageMapping("/auth")
    @SendTo("/topic/auth")
    public String auth(String code) throws IOException, InterruptedException {
        pubSubService.authenticate(code);
        return "{\"state\":\"SUCCESS\"}";
    }
    
    @MessageMapping("/getClientId")
    @SendTo("/topic/auth")
    public String getClientId() throws Exception {
        return "{\"clientId\":\"" + pubSubConfiguration.getClientId() + "\"}";
    }

}
