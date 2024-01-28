package net.erstschlag.playground.websocket;

import java.util.Optional;

public class WidgetDataDto {

    private final String uuid;
    private final Optional<String> data;

    public WidgetDataDto(String uuid, Optional<String> data) {
        this.uuid = uuid;
        this.data = data;
    }

    public String getUuid() {
        return uuid;
    }

    public Optional<String> getData() {
        return data;
    }

}
