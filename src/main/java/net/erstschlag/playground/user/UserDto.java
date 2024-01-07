package net.erstschlag.playground.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.math.BigDecimal;
import net.erstschlag.playground.utils.BigDecimalAsStringDeserializer;
import net.erstschlag.playground.utils.BigDecimalAsStringSerializer;

public class UserDto {

    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("nuggets")
    @JsonSerialize(using = BigDecimalAsStringSerializer.class)
    @JsonDeserialize(using = BigDecimalAsStringDeserializer.class)
    private BigDecimal nuggets;
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

    public BigDecimal getNuggets() {
        return nuggets;
    }

    public void setNuggets(BigDecimal nuggets) {
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
