package net.erstschlag.playground.misc.p4g.client;

import net.erstschlag.playground.misc.p4g.P4GDataDto;
import net.erstschlag.playground.misc.p4g.P4GService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class P4GController {

    private final P4GService p4GService;

    @Autowired
    public P4GController(P4GService p4GService) {
        this.p4GService = p4GService;
    }

    @MessageMapping("/p4gRetrieve")
    @SendTo("/topic/pg4")
    public P4GDataDto getData(String user) {
        return p4GService.getData(user);
    }

    @MessageMapping("/p4gRegister")
    @SendTo("/topic/pg4")
    public P4GDataDto registerData(P4GDataDto data) {
        return p4GService.registerData(data);
    }
}
