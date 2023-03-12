package net.erstschlag.playground.user.client;

import net.erstschlag.playground.user.ChargeUserDto;
import net.erstschlag.playground.user.UserDto;
import net.erstschlag.playground.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public Page<UserDto> getUsers(String filter) {
        return userService.getUsers();
    }
    
    @MessageMapping("/topNuggetHolders")
    @SendTo("/topic/topNuggetHolders")
    public Page<UserDto> getTopNuggetHolders(int limit) {
        return userService.getTopNuggetHolders(limit);
    }

    @MessageMapping("/chargeUser")
    public void chargeUser(ChargeUserDto chargeUser) {
        userService.chargeUser(chargeUser);
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
