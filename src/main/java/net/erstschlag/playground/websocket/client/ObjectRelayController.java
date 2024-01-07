package net.erstschlag.playground.websocket.client;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ObjectRelayController {
    
    @MessageMapping("/object")
    @SendTo("/topic/object")
    public String sendObject(String message) throws Exception {
        return message;
    }
}
