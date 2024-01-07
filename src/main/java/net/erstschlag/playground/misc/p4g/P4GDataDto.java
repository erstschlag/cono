package net.erstschlag.playground.misc.p4g;

import com.fasterxml.jackson.annotation.JsonProperty;

public class P4GDataDto {

    @JsonProperty("user")
    private String user = "ALL";
    @JsonProperty("plex")
    private int plex = 0;
    @JsonProperty("mIsk")
    private int mIsk = 0;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public int getPlex() {
        return plex;
    }

    public void setPlex(int plex) {
        this.plex = plex;
    }

    public int getmIsk() {
        return mIsk;
    }

    public void setmIsk(int mIsk) {
        this.mIsk = mIsk;
    }

}
