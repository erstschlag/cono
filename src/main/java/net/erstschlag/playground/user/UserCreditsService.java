package net.erstschlag.playground.user;

import java.util.Optional;
import net.erstschlag.playground.twitch.pubsub.ChannelBitsEvent;
import net.erstschlag.playground.twitch.pubsub.ChannelSubscribeEvent;
import net.erstschlag.playground.user.repository.UserEntity;
import net.erstschlag.playground.user.repository.UserRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserCreditsService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final UserConfiguration userConfiguration;
    private final MapStructMapper mapstructMapper;
    private final ApplicationEventPublisher applicationEventPublisher;

    public UserCreditsService(UserRepository userRepository,
            UserService userService,
            UserConfiguration userConfiguration,
            MapStructMapper mapstructMapper,
            ApplicationEventPublisher applicationEventPublisher) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.userConfiguration = userConfiguration;
        this.mapstructMapper = mapstructMapper;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public Page<UserDto> getTopNuggetHolders(int limit) {
        return userRepository.findAllByOrderByNuggetsDesc(Pageable.ofSize(limit)).map(mapstructMapper::userEntityToUserDto);
    }

    public synchronized void chargeUser(ChargeUserDto chargeUser) {
        Optional<UserEntity> oUserEntity = userRepository.findById(chargeUser.getUserId());
        if (!oUserEntity.isPresent() || !hasEnoughNuggets(oUserEntity.get(), chargeUser)) {
            return;
        }
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
    
    public synchronized void awardUser(ChargeUserDto chargeUser) {
        Optional<UserEntity> oUserEntity = userRepository.findById(chargeUser.getUserId());
        if (!oUserEntity.isPresent()) {
            return;
        }
        oUserEntity.get().setNuggets(oUserEntity.get().getNuggets() + chargeUser.getAmount());
        userRepository.save(oUserEntity.get());
        applicationEventPublisher.publishEvent(
                new UserAwardedEvent(
                        mapstructMapper.userEntityToUserDto(oUserEntity.get()),
                        chargeUser.getTransactionId(),
                        chargeUser.getAmount(),
                        chargeUser.getReason()
                ));
    }

    private boolean hasEnoughNuggets(UserEntity user, ChargeUserDto chargeUser) {
        return userConfiguration.getChannelId().equalsIgnoreCase(user.getId())
                || user.getNuggets() >= chargeUser.getAmount();
    }

    public void handleBitsEvent(ChannelBitsEvent event) {
        UserEntity uE = userService.retrieveOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
        awardUser(uE, event.getBitsUsed() / 100, "spending " + event.getBitsUsed() + " bits!");
    }

    public void handleSubEvent(ChannelSubscribeEvent event) {
        if (event.getSubTier().getTier() > 1 || event.isGift()) {
            UserEntity uE = userService.retrieveOrCreateUser(event.getUser().get().getId(), event.getUser().get().getName());
            awardUser(uE, 3 * event.getSubTier().getTier(),
                    event.isGift()
                    ? "gifting a tier " + event.getSubTier().getTier() + " sub!"
                    : "subscribing with tier " + event.getSubTier().getTier());
        }
    }

    private void awardUser(UserEntity uE, float numberOfNuggets, String reason) {
        uE.setNuggets(uE.getNuggets() + numberOfNuggets);
        userRepository.save(uE);
        applicationEventPublisher.publishEvent(
                new UserAwardedEvent(
                        mapstructMapper.userEntityToUserDto(uE),
                        "",
                        numberOfNuggets,
                        reason));
    }
}
