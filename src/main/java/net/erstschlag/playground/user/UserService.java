package net.erstschlag.playground.user;

import java.util.Optional;
import net.erstschlag.playground.twitch.pubsub.ChannelBitsEvent;
import net.erstschlag.playground.twitch.pubsub.ChannelSubscribeEvent;
import net.erstschlag.playground.user.repository.UserEntity;
import net.erstschlag.playground.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserConfiguration userConfiguration;
    private final MapStructMapper mapstructMapper;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Autowired
    public UserService(UserRepository userRepository,
            UserConfiguration userConfiguration, 
            MapStructMapper mapstructMapper,
            ApplicationEventPublisher applicationEventPublisher) {
        this.userRepository = userRepository;
        this.userConfiguration = userConfiguration;
        this.mapstructMapper = mapstructMapper;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public Page<UserDto> getUsers() {
        return userRepository.findAll(Pageable.unpaged()).map(mapstructMapper::userEntityToUserDto);
    }

    public Page<UserDto> getTopNuggetHolders(int limit) {
        return userRepository.findAllByOrderByNuggetsDesc(Pageable.ofSize(limit)).map(mapstructMapper::userEntityToUserDto);
    }

    public UserDto getOrCreateUser(String userId, String userName) {
        return mapstructMapper.userEntityToUserDto(retrieveOrCreateUser(userId, userName));
    }

    public Optional<UserDto> getUser(String userId) {
        Optional<UserEntity> oUserEntity = userRepository.findById(userId);
        if (oUserEntity.isPresent()) {
            return Optional.of(mapstructMapper.userEntityToUserDto(oUserEntity.get()));
        } else {
            return Optional.empty();
        }
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public synchronized void chargeUser(ChargeUserDto chargeUser) {
        Optional<UserEntity> oUserEntity = userRepository.findById(chargeUser.getUserId());
        if (oUserEntity.isPresent()) {
            if (userConfiguration.getChannelId().equalsIgnoreCase(oUserEntity.get().getId()) || oUserEntity.get().getNuggets() >= chargeUser.getAmount()) {
                oUserEntity.get().setNuggets(oUserEntity.get().getNuggets() - chargeUser.getAmount());
                userRepository.save(oUserEntity.get());
                applicationEventPublisher.publishEvent(
                        new UserChargedEvent(
                                mapstructMapper.userEntityToUserDto(oUserEntity.get()),
                                chargeUser.getTransactionId(),
                                chargeUser.getAmount(),
                                chargeUser.getReason()
                        ));
            }
        }
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
        awardUser(uE, bitsUsed / 100);
    }

    public final void registerGiftedSub(String userId, String userName, boolean isGift, int tier) {
        if (tier > 1 || isGift) {
            UserEntity uE = retrieveOrCreateUser(userId, userName);
            awardUser(uE, 3 * tier);
        }
    }

    private void awardUser(UserEntity uE, int numberOfNuggets) {
        uE.setNuggets(uE.getNuggets() + numberOfNuggets);
        userRepository.save(uE);
        applicationEventPublisher.publishEvent(
                new UserAwardedEvent(
                        mapstructMapper.userEntityToUserDto(uE),
                        numberOfNuggets));
    }

    private synchronized UserEntity retrieveOrCreateUser(String userId, String userName) {
        Optional<UserEntity> oUserEntity = userRepository.findById(userId);
        if (oUserEntity.isPresent()) {
            if (!userName.equals(oUserEntity.get().getName())) {
                oUserEntity.get().setName(userName);
                userRepository.save(oUserEntity.get());
            }
            return oUserEntity.get();
        } else {
            return userRepository.save(new UserEntity(userId, userName, 0, 0));
        }
    }
}
