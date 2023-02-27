package net.erstschlag.playground.twitch.oauth.client;

import net.erstschlag.playground.twitch.pubsub.PubSubService;
import net.erstschlag.playground.twitch.oauth.PubSubOAuth;
import net.erstschlag.playground.twitch.oauth.TwitchOAuthDto;
import net.erstschlag.playground.twitch.pubsub.PubSubConfiguration;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class OAuthController {

    private final PubSubService pubSubService;
    private final PubSubOAuth pubSubOAuth;
    private final PubSubConfiguration pubSubConfiguration;

    public OAuthController(PubSubService pubSubService, PubSubOAuth pubSubOAuth, PubSubConfiguration pubSubConfiguration) {
        this.pubSubService = pubSubService;
        this.pubSubOAuth = pubSubOAuth;
        this.pubSubConfiguration = pubSubConfiguration;
    }

    @MessageMapping("/auth")
    @SendTo("/topic/auth")
    public String auth(String code) throws Exception {
        TwitchOAuthDto oAuth = pubSubOAuth.authenticate(code);
        pubSubService.initialize(oAuth.getToken());
        return "{\"state\":\"SUCCESS\"}";
    }
    
    @MessageMapping("/getClientId")
    @SendTo("/topic/auth")
    public String getClientId() throws Exception {
        return "{\"clientId\":\"" + pubSubConfiguration.getClientId() + "\"}";
    }

}
