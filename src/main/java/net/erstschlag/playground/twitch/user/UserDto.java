package net.erstschlag.playground.twitch.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDto {
    
    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("shillings")
    private int shillings;
    @JsonProperty("restBits")
    private int restBits;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getShillings() {
        return shillings;
    }

    public void setShillings(int shillings) {
        this.shillings = shillings;
    }

    public int getRestBits() {
        return restBits;
    }

    public void setRestBits(int restBits) {
        this.restBits = restBits;
    }

}
