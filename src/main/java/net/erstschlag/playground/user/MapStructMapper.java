package net.erstschlag.playground.user;

import java.util.stream.Stream;
import net.erstschlag.playground.user.repository.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MapStructMapper {

    UserDto userEntityToUserDto(UserEntity userEntity);

    Stream<UserDto> userEntitiesToUserDtos(Stream<UserEntity> userEntities);
}
