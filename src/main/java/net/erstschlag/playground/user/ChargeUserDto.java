package net.erstschlag.playground.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ChargeUserDto {

    @JsonProperty("userId")
    private String userId;
    @JsonProperty("amount")
    private int amount;
    @JsonProperty("transactionId")
    private String transactionId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

}
