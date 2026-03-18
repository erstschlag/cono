package net.erstschlag.playground.user;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import net.erstschlag.playground.user.repository.UserEntity;
import net.erstschlag.playground.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final long CACHE_TTL_MS = 60_000; // 1 minute

    private final UserRepository userRepository;
    private final MapStructMapper mapstructMapper;
    private final ConcurrentHashMap<String, CachedUser> userCache = new ConcurrentHashMap<>();

    public UserService(UserRepository userRepository,
            MapStructMapper mapstructMapper) {
        this.userRepository = userRepository;
        this.mapstructMapper = mapstructMapper;
    }

    public Page<UserDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(mapstructMapper::userEntityToUserDto);
    }

    public Page<UserDto> getUsersWithNameLike(String search, Pageable pageable) {
        return userRepository.findByNameLike(search, pageable).map(mapstructMapper::userEntityToUserDto);
    }

    public UserDto getOrCreateUser(String userId, String userName) {
        return mapstructMapper.userEntityToUserDto(retrieveOrCreateUser(userId, userName));
    }

    public Optional<UserDto> getUser(String userId) {
        Optional<UserEntity> oUserEntity = userRepository.findById(userId);
        if (oUserEntity.isPresent()) {
            return Optional.of(mapstructMapper.userEntityToUserDto(oUserEntity.get()));
        }
        return Optional.empty();
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
        userCache.remove(userId);
    }

    public Long getWeeklyLPSum() {
        return userRepository.sumWeeklyLP();
    }

    public Integer getUserWeeklyLPRank(String userId) {
        return userRepository.userWeeklyLPRank(userId);
    }

    public void resetWeeklyLP() {
        userRepository.resetWeeklyLP();
    }

    /**
     * Invalidates the cached entry for a user so the next lookup hits the DB.
     * Should be called after external modifications to a user (e.g. credit changes).
     */
    public void invalidateCache(String userId) {
        userCache.remove(userId);
    }

    synchronized UserEntity retrieveOrCreateUser(String userId, String userName) {
        // Check cache first: if the user is cached, the name matches, and the entry is fresh, skip the DB
        CachedUser cached = userCache.get(userId);
        if (cached != null && userName.equals(cached.userName) && !cached.isExpired()) {
            return cached.entity;
        }

        Optional<UserEntity> oUserEntity = userRepository.findById(userId);
        if (oUserEntity.isPresent()) {
            if (!userName.equals(oUserEntity.get().getName())) {
                freeupUserName(userName);
                oUserEntity.get().setName(userName);
                userRepository.save(oUserEntity.get());
            }
            userCache.put(userId, new CachedUser(oUserEntity.get(), userName));
            return oUserEntity.get();
        } else {
            freeupUserName(userName);
            UserEntity newUser = userRepository.save(new UserEntity(userId, userName, BigDecimal.ZERO));
            userCache.put(userId, new CachedUser(newUser, userName));
            return newUser;
        }
    }

    private void freeupUserName(String userName) {
        Optional<UserEntity> oExistingUserByName = userRepository.findByName(userName);
        if (oExistingUserByName.isPresent()) {
            oExistingUserByName.get().setName(UUID.randomUUID().toString());
            userRepository.save(oExistingUserByName.get());
            // Invalidate the old user whose name was freed up
            userCache.remove(oExistingUserByName.get().getId());
        }
    }

    private static class CachedUser {
        final UserEntity entity;
        final String userName;
        final long cachedAt;

        CachedUser(UserEntity entity, String userName) {
            this.entity = entity;
            this.userName = userName;
            this.cachedAt = System.currentTimeMillis();
        }

        boolean isExpired() {
            return System.currentTimeMillis() - cachedAt > CACHE_TTL_MS;
        }
    }
}
