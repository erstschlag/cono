package net.erstschlag.playground.twitch.user.client;

import java.util.List;
import net.erstschlag.playground.twitch.user.UserDto;
import net.erstschlag.playground.twitch.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @MessageMapping("/users")
    @SendTo("/topic/users")
    public List<UserDto> getUsers(String filter) {
        return userService.getUsers();
    }

    @MessageMapping("/users/delete")
    public void deleteUser(String userId) {
        userService.deleteUser(userId);
    }

    @MessageMapping("/users/registerBits")
    public void registerBits(UserDto user) {
        userService.registerBits(user.getId(), user.getName(), user.getRestBits());
    }

    @MessageMapping("/users/registerGiftedSub")
    public void registerGiftedSub(UserDto user) {
        userService.registerGiftedSub(user.getId(), user.getName(), true, 1);
    }
}
