package net.erstschlag.playground.twitch.oauth;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import net.erstschlag.playground.twitch.pubsub.PubSubConfiguration;

@Component
public class PubSubOAuth {

    private final PubSubConfiguration pubSubConfiguration;

    public PubSubOAuth(PubSubConfiguration pubSubConfiguration) {
        this.pubSubConfiguration = pubSubConfiguration;
    }

    public TwitchOAuthDto authenticate(String code) throws IOException, InterruptedException {
        String postValues = "client_id=" + pubSubConfiguration.getClientId() + "&"
                + "client_secret=" + pubSubConfiguration.getClientSecret() + "&"
                + "code=" + code + "&"
                + "grant_type=authorization_code" + "&"
                + "redirect_uri=http://localhost:8081/oAuth3.html";

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
