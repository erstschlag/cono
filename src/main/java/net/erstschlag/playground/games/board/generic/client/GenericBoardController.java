package net.erstschlag.playground.games.board.generic.client;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GenericBoardController {

    @MessageMapping("/gbm")
    @SendTo("/topic/gbm")
    public String boardMove(String move) throws Exception {
        return move;
    }
    
    @MessageMapping("/object")
    @SendTo("/topic/object")
    public String sendObject(String message) throws Exception {
        return message;
    }
}
