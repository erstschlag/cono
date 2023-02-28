package net.erstschlag.playground.twitch.user.repository;

import jakarta.persistence.*;

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
    @Column(name = "nuggets", unique = false, nullable = false)
    private int nuggets;

    @Basic
    @Column(name = "restBits", unique = false, nullable = false)
    private int restBits;

    public UserEntity() {

    }

    public UserEntity(String id, String name, int nuggets, int restBits) {
        this.id = id;
        this.name = name;
        this.nuggets = nuggets;
        this.restBits = restBits;
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

    public int getNuggets() {
        return nuggets;
    }

    public void setNuggets(int nuggets) {
        this.nuggets = nuggets;
    }

    public int getRestBits() {
        return restBits;
    }

    public void setRestBits(int restBits) {
        this.restBits = restBits;
    }

}
