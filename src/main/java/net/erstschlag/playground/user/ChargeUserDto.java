package net.erstschlag.playground.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.math.BigDecimal;
import net.erstschlag.playground.utils.BigDecimalAsStringDeserializer;
import net.erstschlag.playground.utils.BigDecimalAsStringSerializer;

public class ChargeUserDto {

    @JsonProperty("userId")
    private String userId;
    @JsonProperty("amount")
    @JsonSerialize(using = BigDecimalAsStringSerializer.class)
    @JsonDeserialize(using = BigDecimalAsStringDeserializer.class)
    private BigDecimal amount;
    @JsonProperty("transactionId")
    private String transactionId;
    @JsonProperty("reason")
    private String reason;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

}
