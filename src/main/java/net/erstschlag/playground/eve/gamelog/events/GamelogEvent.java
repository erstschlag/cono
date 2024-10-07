package net.erstschlag.playground.eve.gamelog.events;

import net.erstschlag.playground.PlaygroundEvent;
import java.util.Optional;

public class GamelogEvent extends PlaygroundEvent<GamelogEvent> {

    private final String characterName;
    private final String gamelogLine;

    public GamelogEvent(String characterName, String gamelogLine) {
        super(Optional.empty());
        this.characterName = characterName;
        this.gamelogLine = gamelogLine;
    }

    public String getCharacterName() {
        return characterName;
    }

    public String getGamelogLine() {
        return gamelogLine;
    }

    @Override
    public String toString() {
        return super.toString() + " => GamelogEvent{" + "characterName=" + characterName + ", gamelogLine=" + gamelogLine + " }";
    }

}
