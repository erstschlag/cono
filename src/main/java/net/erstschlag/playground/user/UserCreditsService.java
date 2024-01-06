package net.erstschlag.playground.user;

import java.math.BigDecimal;
import net.erstschlag.playground.twitch.pubsub.ChannelBitsEvent;
import net.erstschlag.playground.twitch.pubsub.ChannelGiftedSubscriptionsEvent;
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
    private final UserConfiguration userConfiguration;
    private final MapStructMapper mapstructMapper;
    private final ApplicationEventPublisher applicationEventPublisher;

    public UserCreditsService(UserRepository userRepository,
            UserService userService,
            UserConfiguration userConfiguration,
            MapStructMapper mapstructMapper,
            ApplicationEventPublisher applicationEventPublisher) {
        this.userRepository = userRepository;
        this.userConfiguration = userConfiguration;
        this.mapstructMapper = mapstructMapper;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public Page<UserDto> getTopNuggetHolders(int limit) {
        return userRepository.findAllByOrderByNuggetsDesc(Pageable.ofSize(limit)).map(mapstructMapper::userEntityToUserDto);
    }

    public void chargeUser(ChargeUserDto chargeUser) {
        modifyUserCredits(chargeUser.getUserId(), chargeUser.getAmount().negate(), chargeUser.getReason(), chargeUser.getTransactionId());
    }
    
    public void awardUser(ChargeUserDto chargeUser) {
        modifyUserCredits(chargeUser.getUserId(), chargeUser.getAmount(), chargeUser.getReason(), chargeUser.getTransactionId());
    }

    public void handleBitsEvent(ChannelBitsEvent event) {
        modifyUserCredits(event.getUser().get().getId(), BigDecimal.valueOf(event.getBitsUsed()).divide(BigDecimal.valueOf(100)), "spending " + event.getBitsUsed() + " bits!", "");
    }

    public void handleSubEvent(ChannelSubscribeEvent event) {
        if (!event.isGift() && event.getSubTier().getTier() > 1) {
            modifyUserCredits(event.getUser().get().getId(), BigDecimal.valueOf(3 * event.getSubTier().getTier()),
                    "subscribing with tier " + event.getSubTier().getTier(), "");
        }
    }
    
    public void handleGiftedSubsEvent(ChannelGiftedSubscriptionsEvent event) {
        modifyUserCredits(event.getUser().get().getId(), BigDecimal.valueOf(3 * event.getSubTier().getTier() * event.getCount()),
                "gifting " + event.getCount() + " tier " + event.getSubTier().getTier()
                + (event.getCount() > 1 ? " subs!" : "sub!"), ""
        );
    }

    private synchronized void modifyUserCredits(String userId, BigDecimal nuggetsChange, String reason, String transactionId) {
        if (nuggetsChange == BigDecimal.ZERO) {
            return;
        }
        UserEntity uE = userRepository.findById(userId).orElse(null);
        if (uE == null) {
            return;
        }
        if (nuggetsChange.compareTo(BigDecimal.ZERO) >= 0) {
            uE.setNuggets(uE.getNuggets().add(nuggetsChange));
            userRepository.save(uE);
            applicationEventPublisher.publishEvent(
                    new UserAwardedEvent(
                            mapstructMapper.userEntityToUserDto(uE),
                            transactionId,
                            nuggetsChange,
                            reason));
        } else if (hasEnoughNuggets(uE, nuggetsChange.negate())) {
            uE.setNuggets(uE.getNuggets().add(nuggetsChange));
            userRepository.save(uE);
            applicationEventPublisher.publishEvent(
                    new UserChargedEvent(
                            mapstructMapper.userEntityToUserDto(uE),
                            transactionId,
                            nuggetsChange.negate(),
                            reason
                    ));
        }
    }

    private boolean hasEnoughNuggets(UserEntity user, BigDecimal nuggetsCost) {
        return userConfiguration.getChannelId().equalsIgnoreCase(user.getId())
                || user.getNuggets().compareTo(nuggetsCost) >= 0;
    }
}
