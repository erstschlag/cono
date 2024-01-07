package net.erstschlag.playground.user;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.math.BigDecimal;
import java.util.Optional;
import net.erstschlag.playground.PlaygroundEvent;
import net.erstschlag.playground.utils.BigDecimalAsStringDeserializer;
import net.erstschlag.playground.utils.BigDecimalAsStringSerializer;

abstract class UserCreditsChangedEvent<T extends PlaygroundEvent> extends PlaygroundEvent<T> {

    private final String transactionId;
    @JsonSerialize(using = BigDecimalAsStringSerializer.class)
    @JsonDeserialize(using = BigDecimalAsStringDeserializer.class)
    private final BigDecimal amount;
    private final String reason;

    public UserCreditsChangedEvent(UserDto oUser, String transactionId, BigDecimal amount, String reason) {
        super(Optional.of(oUser));
        this.transactionId = transactionId;
        this.amount = amount;
        this.reason = reason;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getReason() {
        return reason;
    }
}
