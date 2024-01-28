package net.erstschlag.playground.user.client;

import net.erstschlag.playground.user.ChargeUserDto;
import net.erstschlag.playground.user.UserCreditsService;
import net.erstschlag.playground.user.UserDto;
import net.erstschlag.playground.user.UserLPRecorder;
import net.erstschlag.playground.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {

    private final UserService userService;
    private final UserCreditsService userCreditsService;
    private final UserLPRecorder userLPRecorder;

    public UserController(UserService userService,
            UserCreditsService userCreditsService,
            UserLPRecorder userLPRecorder) {
        this.userService = userService;
        this.userCreditsService = userCreditsService;
        this.userLPRecorder = userLPRecorder;
    }

    @MessageMapping("/users")
    @SendTo("/topic/users")
    public Page<UserDto> getUsers(PageableRequest pageableRequest) {
        return userService.getUsers(PageRequest.of(pageableRequest.getPage(),
                pageableRequest.getSize(),
                Sort.Direction.fromString(pageableRequest.getSortDirection()),
                pageableRequest.getSortFields()));
    }

    @MessageMapping("/usersWithNameLike")
    @SendTo("/topic/users")
    public Page<UserDto> getUsersWithNameLike(SearchByNameRequest searchByNameRequest) {
        return userService.getUsersWithNameLike(searchByNameRequest.getSearch(), PageRequest.of(searchByNameRequest.getPageableRequest().getPage(),
                searchByNameRequest.getPageableRequest().getSize(),
                Sort.Direction.fromString(searchByNameRequest.getPageableRequest().getSortDirection()),
                searchByNameRequest.getPageableRequest().getSortFields()));
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

    @MessageMapping("/awardUser")
    public void awardUser(ChargeUserDto chargeUser) {
        userCreditsService.awardUser(chargeUser);
    }

    @MessageMapping("/users/delete")
    public void deleteUser(String userId) {
        userService.deleteUser(userId);
    }

    @MessageMapping("/users/enableLPCollection")
    @SendTo("/topic/isLPCollectionEnabled")
    public boolean enableUserLPCollection(boolean enable) {
        return userLPRecorder.enableLPCollection(enable);
    }

    @MessageMapping("/users/isLPCollectionEnabled")
    @SendTo("/topic/isLPCollectionEnabled")
    public boolean isUserLPCollectionEnabled() {
        return userLPRecorder.isLPCollectionEnabled();
    }

    @MessageMapping("/users/weeklyLPSum")
    @SendTo("/topic/weeklyLPSum")
    public Long getWeeklyLPSum() {
        return userService.getWeeklyLPSum();
    }

    @MessageMapping("/users/resetWeeklyLP")
    public void resetWeeklyLP() {
        userService.resetWeeklyLP();
    }
}
