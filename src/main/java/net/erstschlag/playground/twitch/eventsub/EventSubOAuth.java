package net.erstschlag.playground.twitch.eventsub;


import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;

@Component
public class EventSubOAuth {

    private final EventSubConfiguration eventSubConfiguration;

    public EventSubOAuth(EventSubConfiguration eventSubConfiguration) {
        this.eventSubConfiguration = eventSubConfiguration;
    }

    public TwitchOAuthDto authenticate(String code) throws IOException, InterruptedException {
        return postAuth("client_id=" + eventSubConfiguration.getClientId() + "&"
                + "client_secret=" + eventSubConfiguration.getClientSecret() + "&"
                + "code=" + code + "&"
                + "grant_type=authorization_code" + "&"
                + "redirect_uri=http://localhost:8081/oAuth3.html");
    }

    public TwitchOAuthDto refresh(TwitchOAuthDto twitchOAuthDto) throws IOException, InterruptedException {
        return postAuth("client_id=" + eventSubConfiguration.getClientId() + "&"
                + "client_secret=" + eventSubConfiguration.getClientSecret() + "&"
                + "grant_type=refresh_token" + "&"
                + "refresh_token=" + UriUtils.encode(twitchOAuthDto.getRefreshToken(), StandardCharsets.UTF_8));
    }

    private TwitchOAuthDto postAuth(String postValues) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://id.twitch.tv/oauth2/token"))
                .POST(HttpRequest.BodyPublishers.ofString(postValues))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        return new ObjectMapper().readValue(response.body(), TwitchOAuthDto.class);
    }

}
