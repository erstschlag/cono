package net.erstschlag.playground.eve.gamelog;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.util.logging.Level;
import java.util.logging.Logger;
import net.erstschlag.playground.eve.gamelog.events.GamelogEvent;
import org.springframework.context.ApplicationEventPublisher;

public class GamelogReader implements Runnable {

    private volatile boolean run = true;
    private final GamelogService gamelogService;
    private final Path file;
    private final ApplicationEventPublisher applicationEventPublisher;
    private String characterName = null;
    private static final String CHARACTER_NAME_LINE_IDENTIFICATION_PREFIX = "Listener: ";

    public GamelogReader(GamelogService gamelogService, ApplicationEventPublisher applicationEventPublisher, Path file) {
        this.gamelogService = gamelogService;
        this.applicationEventPublisher = applicationEventPublisher;
        this.file = file;
    }

    @Override
    public void run() {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file.toFile()));
            String line;
            while (run) {
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (characterName == null && line.startsWith(CHARACTER_NAME_LINE_IDENTIFICATION_PREFIX)) {
                        characterName = line.substring(line.indexOf("Listener: ") + CHARACTER_NAME_LINE_IDENTIFICATION_PREFIX.length());
                        Logger.getLogger(GamelogReader.class.getName()).log(Level.INFO, "Initializing log reader for character {0}", characterName);
                        gamelogService.registerGamelogReader(this);
                    }
                    if (characterName == null && line.startsWith("Session Started: ")) {
                        run = false;
                    }
                    if (characterName != null) {
                        applicationEventPublisher.publishEvent(
                                new GamelogEvent(characterName, line));
                    }
                }
                // Pause to avoid busy-waiting
                Thread.sleep(50);
            }
        } catch (FileNotFoundException ex) {
            Logger.getLogger(GamelogReader.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InterruptedException | IOException ex) {
            Logger.getLogger(GamelogReader.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                reader.close();
            } catch (IOException ex) {
                Logger.getLogger(GamelogReader.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public void shutDown() {
        run = false;
    }

    public String getCharacterName() {
        return characterName;
    }
}
