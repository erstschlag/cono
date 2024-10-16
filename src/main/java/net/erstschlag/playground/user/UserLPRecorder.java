package net.erstschlag.playground.user;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import net.erstschlag.playground.twitch.pubsub.events.ChatMessageEvent;
import net.erstschlag.playground.twitch.pubsub.PubSubService;
import net.erstschlag.playground.user.repository.UserEntity;
import net.erstschlag.playground.user.repository.UserRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class UserLPRecorder {

    private final PubSubService twitchService;
    private final UserRepository userRepository;
    private final HashMap<String, UserDto> eligibleUsersMap = new HashMap<>();
    private final List<String> userBlacklist = new ArrayList<>();
    private boolean lpCollectionEnabled = false;

    public UserLPRecorder(PubSubService pubSubService, UserRepository userRepository, LPConfiguration lpConfiguration) {
        this.twitchService = pubSubService;
        this.userRepository = userRepository;
        userBlacklist.addAll(Arrays.asList(
                lpConfiguration.getBlacklist().split(",")));
    }

    public boolean enableLPCollection(boolean enable) {
        lpCollectionEnabled = enable;
        return lpCollectionEnabled;
    }

    public boolean isLPCollectionEnabled() {
        return lpCollectionEnabled;
    }

    @Scheduled(initialDelay = 300000, fixedRate = 300000)
    public void scheduleLPTick() {
        if (!lpCollectionEnabled) {
            return;
        }
        List<String> chatters = twitchService.getChatters();
        for (Map.Entry<String, UserDto> userTalkedEntry : eligibleUsersMap.entrySet()) {
            if (chatters.contains(userTalkedEntry.getKey())) {
                Optional<UserEntity> userEntity = userRepository.findById(userTalkedEntry.getValue().getId());
                if (userEntity.isPresent()) {
                    userEntity.get().setTotalLP(userEntity.get().getTotalLP() + 1);
                    userEntity.get().setWeeklyLP(userEntity.get().getWeeklyLP() + 1);
                    userRepository.save(userEntity.get());
                }
            }
        }
    }

    @EventListener
    public void eventReceived(ChatMessageEvent chatMessageEvent) {
        UserDto user = chatMessageEvent.getUser().get();
        if (canCollectLP(user.getName()) && !"!raffle".equals(chatMessageEvent.getMessage())) {
            eligibleUsersMap.put(user.getName(), user);
        }
    }

    private boolean canCollectLP(String userName) {
        return !userBlacklist.contains(userName);
    }

}
