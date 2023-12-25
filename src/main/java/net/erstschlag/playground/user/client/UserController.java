package net.erstschlag.playground.user.client;

import java.util.stream.Stream;
import net.erstschlag.playground.user.ChargeUserDto;
import net.erstschlag.playground.user.UserCreditsService;
import net.erstschlag.playground.user.UserDto;
import net.erstschlag.playground.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {

    private final UserService userService;
    private final UserCreditsService userCreditsService;

    public UserController(UserService userService,
            UserCreditsService userCreditsService) {
        this.userService = userService;
        this.userCreditsService = userCreditsService;
    }

    @MessageMapping("/users")
    @SendTo("/topic/users")
    public Stream<UserDto> getUsers(String filter) {
        return userService.getUsers();
    }

    @MessageMapping("/topNuggetHolders")
    @SendTo("/topic/topNuggetHolders")
    public Page<UserDto> getTopNuggetHolders(int limit) {
        return userCreditsService.getTopNuggetHolders(limit);
    }

    @MessageMapping("/chargeUser")
    public void chargeUser(ChargeUserDto chargeUser) {
        userCreditsService.chargeUser(chargeUser);
    }

    @MessageMapping("/users/delete")
    public void deleteUser(String userId) {
        userService.deleteUser(userId);
    }
}
