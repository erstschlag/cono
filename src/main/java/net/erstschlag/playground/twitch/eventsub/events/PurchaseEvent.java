package net.erstschlag.playground.twitch.eventsub.events;

import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.user.UserDto;

public class PurchaseEvent extends PlaygroundEvent<PurchaseEvent> {

    private final String consumer;
    private final String command;
    private final Integer amount;

    public PurchaseEvent(Optional<UserDto> user, String consumer, String command, int amount) {
        super(user);
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

    @Override
    public String toString() {
        return super.toString() + " => PurchaseEvent{" + "consumer=" + consumer + ", command=" + command + ", amount=" + amount + '}';
    }

}
