package net.erstschlag.playground.user;

import java.util.Optional;
import java.util.stream.Stream;
import net.erstschlag.playground.user.repository.UserEntity;
import net.erstschlag.playground.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MapStructMapper mapstructMapper;

    public UserService(UserRepository userRepository,
            MapStructMapper mapstructMapper) {
        this.userRepository = userRepository;
        this.mapstructMapper = mapstructMapper;
    }

    public Page<UserDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(mapstructMapper::userEntityToUserDto);
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
    }

    synchronized UserEntity retrieveOrCreateUser(String userId, String userName) {
        Optional<UserEntity> oUserEntity = userRepository.findById(userId);
        if (oUserEntity.isPresent()) {
            if (!userName.equals(oUserEntity.get().getName())) {
                oUserEntity.get().setName(userName);
                userRepository.save(oUserEntity.get());
            }
            return oUserEntity.get();
        } else {
            return userRepository.save(new UserEntity(userId, userName, 0));
        }
    }
}
