package net.erstschlag.playground.twitch.user;

import java.util.List;
import net.erstschlag.playground.twitch.user.repository.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MapStructMapper {

    UserDto userEntityToUserDto(UserEntity userEntity);

    List<UserDto> userEntitiesToUserDtos(List<UserEntity> userEntities);
}
