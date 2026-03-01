package net.erstschlag.playground.twitch.eventsub.client;

import java.io.IOException;
import net.erstschlag.playground.twitch.eventsub.EventSubService;
import net.erstschlag.playground.twitch.eventsub.EventSubConfiguration;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class OAuthController {

    private final EventSubService eventSubService;
    private final EventSubConfiguration eventSubConfiguration;

    public OAuthController(EventSubService eventSubService, EventSubConfiguration eventSubConfiguration) {
        this.eventSubService = eventSubService;
        this.eventSubConfiguration = eventSubConfiguration;
    }

    @MessageMapping("/auth")
    @SendTo("/topic/auth")
    public String auth(String code) throws IOException, InterruptedException {
        eventSubService.authenticate(code);
        return "{\"state\":\"SUCCESS\"}";
    }
    
    @MessageMapping("/getClientId")
    @SendTo("/topic/auth")
    public String getClientId() throws Exception {
        return "{\"clientId\":\"" + eventSubConfiguration.getClientId() + "\"}";
    }

}
