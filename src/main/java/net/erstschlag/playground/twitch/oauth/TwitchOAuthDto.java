package net.erstschlag.playground.twitch.oauth;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TwitchOAuthDto {

    @JsonProperty("access_token")
    private String token;
    @JsonProperty("expires_in")
    private Integer expireMS;
    @JsonProperty("refresh_token")
    private String refreshToken;
    @JsonProperty("scope")
    private String[] scopes;
    @JsonProperty("token_type")
    private String tokenType;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getExpireMS() {
        return expireMS;
    }

    public void setExpireMS(Integer expireMS) {
        this.expireMS = expireMS;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String[] getScopes() {
        return scopes;
    }

    public void setScopes(String[] scopes) {
        this.scopes = scopes;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

}
