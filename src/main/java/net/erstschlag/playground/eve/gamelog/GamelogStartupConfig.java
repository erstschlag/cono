package net.erstschlag.playground.eve.gamelog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GamelogStartupConfig {

    @Autowired
    private GamelogService gamelogService;

    @Bean
    public ApplicationRunner startMonitoringRunner() {
        return args -> {
            gamelogService.startMonitoring();
        };
    }
}