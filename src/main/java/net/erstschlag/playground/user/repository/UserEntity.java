package net.erstschlag.playground.user.repository;

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
    private float nuggets;

    public UserEntity() {

    }

    public UserEntity(String id, String name, float nuggets) {
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

    public float getNuggets() {
        return nuggets;
    }

    public void setNuggets(float nuggets) {
        this.nuggets = nuggets;
    }

}
