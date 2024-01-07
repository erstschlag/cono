package net.erstschlag.playground.twitch.pubsub;


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
public class PubSubOAuth {

    private final PubSubConfiguration pubSubConfiguration;

    public PubSubOAuth(PubSubConfiguration pubSubConfiguration) {
        this.pubSubConfiguration = pubSubConfiguration;
    }

    public TwitchOAuthDto authenticate(String code) throws IOException, InterruptedException {
        return postAuth("client_id=" + pubSubConfiguration.getClientId() + "&"
                + "client_secret=" + pubSubConfiguration.getClientSecret() + "&"
                + "code=" + code + "&"
                + "grant_type=authorization_code" + "&"
                + "redirect_uri=http://localhost:8081/oAuth3.html");
    }

    public TwitchOAuthDto refresh(TwitchOAuthDto twitchOAuthDto) throws IOException, InterruptedException {
        return postAuth("client_id=" + pubSubConfiguration.getClientId() + "&"
                + "client_secret=" + pubSubConfiguration.getClientSecret() + "&"
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
