package net.erstschlag.playground.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDto {

    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("nuggets")
    private float nuggets;

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

    public float getNuggets() {
        return nuggets;
    }

    public void setNuggets(float nuggets) {
        this.nuggets = nuggets;
    }

}
