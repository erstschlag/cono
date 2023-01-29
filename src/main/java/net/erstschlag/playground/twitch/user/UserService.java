package net.erstschlag.playground.twitch.user;

import com.github.twitch4j.pubsub.events.ChannelBitsEvent;
import com.github.twitch4j.pubsub.events.ChannelSubscribeEvent;
import java.util.List;
import java.util.Optional;
import net.erstschlag.playground.twitch.user.repository.UserEntity;
import net.erstschlag.playground.twitch.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MapStructMapper mapstructMapper;

    @Autowired
    public UserService(UserRepository userRepository, MapStructMapper mapstructMapper) {
        this.userRepository = userRepository;
        this.mapstructMapper = mapstructMapper;
    }

    public List<UserDto> getUsers() {
        return mapstructMapper.userEntitiesToUserDtos(userRepository.findAll());
    }

    public UserDto getUser(String userId, String userName) {
        return mapstructMapper.userEntityToUserDto(retrieveOrCreateUser(userId, userName));
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public void handleBitsEvent(ChannelBitsEvent event) {
        registerBits(event.getData().getUserId(), event.getData().getUserName(), event.getData().getBitsUsed());
    }

    public void handleSubEvent(ChannelSubscribeEvent event) {
        registerGiftedSub(
                event.getData().getUserId(),
                event.getData().getUserName(),
                event.getData().getIsGift(),
                SubTier.fromSubPlan(event.getData().getSubPlan()).getTier());
    }

    public final void registerBits(String userId, String userName, int numberOfBits) {
        UserEntity uE = retrieveOrCreateUser(userId, userName);
        int bitsUsed = numberOfBits + uE.getRestBits();
        uE.setRestBits(bitsUsed % 100);
        bitsUsed -= uE.getRestBits();
        uE.setShillings(uE.getShillings() + bitsUsed / 100);
        userRepository.save(uE);
    }

    public final void registerGiftedSub(String userId, String userName, boolean isGift, int tier) {
        if (tier > 1 || isGift) {
            UserEntity uE = retrieveOrCreateUser(userId, userName);
            uE.setShillings(uE.getShillings() + 3 * tier);
            userRepository.save(uE);
        }
    }

    private synchronized UserEntity retrieveOrCreateUser(String userId, String userName) {
        Optional<UserEntity> oUserEntity = userRepository.findById(userId);
        if (oUserEntity.isPresent()) {
            return oUserEntity.get();
        } else {
            return userRepository.save(new UserEntity(userId, userName, 0, 0));
        }
    }
}
