package net.erstschlag.playground.eve.gamelog;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class GamelogService {

    private final Path logDir = Paths.get(System.getProperty("user.home"),"Documents/EVE/logs/Gamelogs");
    private final HashMap<String, GamelogReader> characterGamelogReaderLookup = new HashMap<>();
    private final ApplicationEventPublisher applicationEventPublisher;

    public GamelogService(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }
    
    @Async
    public void startMonitoring() {
        try {
            Logger.getLogger(GamelogService.class.getName()).log(Level.INFO, "Starting gamelog observer for directory {0}", logDir.toAbsolutePath());
            WatchService watchService = FileSystems.getDefault().newWatchService();
            logDir.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);
            while (true) {
                WatchKey key = watchService.take();
                for (WatchEvent<?> event : key.pollEvents()) {
                    if (event.kind() == StandardWatchEventKinds.OVERFLOW) {
                        continue;
                    }
                    WatchEvent<Path> ev = (WatchEvent<Path>) event;
                    if (ev.kind() == StandardWatchEventKinds.ENTRY_CREATE) {
                        Logger.getLogger(GamelogService.class.getName()).log(Level.INFO, "New gamelog detected, starting reader...");
                        new Thread(new GamelogReader(this, applicationEventPublisher, logDir.resolve(ev.context()))).start();
                    }
                }
                boolean valid = key.reset();
                if (!valid) {
                    break;
                }
            }
        } catch (IOException | InterruptedException ex) {
            Logger.getLogger(GamelogReader.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    void registerGamelogReader(GamelogReader gamelogReader) {
        synchronized (characterGamelogReaderLookup) {
            GamelogReader old = characterGamelogReaderLookup.put(gamelogReader.getCharacterName(), gamelogReader);
            if (old != null) {
                old.shutDown();
            }
        }
    }
}
