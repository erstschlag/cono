package net.erstschlag.playground.twitch.pubsub.events;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.user.UserDto;

public class PurchaseEvent extends PlaygroundEvent<PurchaseEvent> {

    private final String consumer;
    private final String command;
    private final Integer amount;

    public PurchaseEvent(UserDto user, String consumer, String command, int amount) {
        super(Optional.of(user));
        this.consumer = consumer;
        this.command = command;
        this.amount = amount;
    }

    public String getConsumer() {
        return consumer;
    }

    public String getCommand() {
        return command;
    }

    public int getAmount() {
        return amount;
    }

}
