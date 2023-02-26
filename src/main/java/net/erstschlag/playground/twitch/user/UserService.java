package net.erstschlag.playground.twitch.user;

import java.util.Optional;
import net.erstschlag.playground.twitch.pubsub.ChannelBitsEvent;
import net.erstschlag.playground.twitch.pubsub.ChannelSubscribeEvent;
import net.erstschlag.playground.twitch.user.repository.UserEntity;
import net.erstschlag.playground.twitch.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public Page<UserDto> getUsers() {
        return userRepository.findAll(Pageable.unpaged()).map(mapstructMapper::userEntityToUserDto);
    }

    public Page<UserDto> getTopShillingHolders(int limit) {
        return userRepository.findAllByOrderByShillingsDesc(Pageable.ofSize(limit)).map(mapstructMapper::userEntityToUserDto);
    }

    public UserDto getUser(String userId, String userName) {
        return mapstructMapper.userEntityToUserDto(retrieveOrCreateUser(userId, userName));
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public void handleBitsEvent(ChannelBitsEvent event) {
        registerBits(event.getUser().get().getId(), event.getUser().get().getName(), event.getBitsUsed());
    }

    public void handleSubEvent(ChannelSubscribeEvent event) {
        registerGiftedSub(
                event.getUser().get().getId(),
                event.getUser().get().getName(),
                event.isGift(),
                event.getSubTier().getTier());
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
