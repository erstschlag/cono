package net.erstschlag.playground.user;

import java.util.List;
import net.erstschlag.playground.user.repository.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MapStructMapper {

    UserDto userEntityToUserDto(UserEntity userEntity);

    List<UserDto> userEntitiesToUserDtos(List<UserEntity> userEntities);
}
