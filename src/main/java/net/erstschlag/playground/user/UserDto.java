package net.erstschlag.playground.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDto {

    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("nuggets")
    private float nuggets;
    @JsonProperty("weeklyLP")
    private int weeklyLP;
    @JsonProperty("totalLP")
    private int totalLP;

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

    public int getWeeklyLP() {
        return weeklyLP;
    }

    public void setWeeklyLP(int weeklyLP) {
        this.weeklyLP = weeklyLP;
    }

    public int getTotalLP() {
        return totalLP;
    }

    public void setTotalLP(int totalLP) {
        this.totalLP = totalLP;
    }

}
