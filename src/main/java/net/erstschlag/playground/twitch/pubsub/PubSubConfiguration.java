package net.erstschlag.playground.twitch.pubsub;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "pubsub")
public class PubSubConfiguration {

    private String channelId;
    private String clientId;
    private String clientSecret;
    private String channelName;
    private String chatBotOAuthToken;

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public String getChatBotOAuthToken() {
        return chatBotOAuthToken;
    }

    public void setChatBotOAuthToken(String chatBotOAuthToken) {
        this.chatBotOAuthToken = chatBotOAuthToken;
    }

}
