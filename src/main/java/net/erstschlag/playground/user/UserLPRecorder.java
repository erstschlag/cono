package net.erstschlag.playground.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import net.erstschlag.playground.twitch.pubsub.ChatMessageEvent;
import net.erstschlag.playground.twitch.pubsub.PubSubConfiguration;
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
    private final PubSubConfiguration pubSubConfiguration;
    private final HashMap<String, UserDto> eligibleUsersMap = new HashMap<>();

    public UserLPRecorder(PubSubService pubSubService, UserRepository userRepository, PubSubConfiguration pubSubConfiguration) {
        this.twitchService = pubSubService;
        this.userRepository = userRepository;
        this.pubSubConfiguration = pubSubConfiguration;
    }

    @Scheduled(initialDelay = 300000, fixedRate = 300000)
    public void scheduleLPTick() {
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
        return !pubSubConfiguration.getChannelName().equals(userName);
    }

}
