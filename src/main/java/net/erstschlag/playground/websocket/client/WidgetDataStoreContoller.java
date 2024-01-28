package net.erstschlag.playground.websocket.client;

import java.util.HashMap;
import java.util.Optional;
import net.erstschlag.playground.websocket.WidgetDataDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WidgetDataStoreContoller {

    private final HashMap<String, WidgetDataDto> storage = new HashMap<>();

    @MessageMapping("/store")
    @SendTo("/topic/store")
    public WidgetDataDto store(WidgetDataDto data) throws Exception {
        storage.put(data.getUuid(), data);
        return data;
    }

    @MessageMapping("/loadFromStorage")
    @SendTo("/topic/store")
    public WidgetDataDto loadFromStorage(String uuid) throws Exception {
        WidgetDataDto data = storage.get(uuid);
        if (data != null) {
            return data;
        } else {
            return new WidgetDataDto(uuid, Optional.empty());
        }
    }
}
