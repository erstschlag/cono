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
    @Column(name = "shillings", unique = false, nullable = false)
    private int shillings;

    @Basic
    @Column(name = "restBits", unique = false, nullable = false)
    private int restBits;

    public UserEntity() {

    }

    public UserEntity(String id, String name, int shillings, int restBits) {
        this.id = id;
        this.name = name;
        this.shillings = shillings;
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
