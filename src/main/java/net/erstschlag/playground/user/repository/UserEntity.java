package net.erstschlag.playground.user.repository;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "twitch_user")
public class UserEntity {

    @Id
    @Column(name = "id", unique = true, nullable = false)
    private String id;

    @Basic
    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Basic
    @Column(name = "nuggets", unique = false, nullable = false, columnDefinition = "numeric(10,2)")
    private BigDecimal nuggets;

    @Basic
    @Column(name = "weekly_lp", unique = false, nullable = false, columnDefinition = "int default 0")
    private int weeklyLP;

    @Basic
    @Column(name = "total_lp", unique = false, nullable = false, columnDefinition = "int default 0")
    private int totalLP;

    public UserEntity() {

    }

    public UserEntity(String id, String name, BigDecimal nuggets) {
        this.id = id;
        this.name = name;
        this.nuggets = nuggets;
    }

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
