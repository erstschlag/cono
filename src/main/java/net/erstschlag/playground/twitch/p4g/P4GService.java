package net.erstschlag.playground.twitch.p4g;

import java.util.HashMap;
import org.springframework.stereotype.Service;

@Service
public class P4GService {

    public final HashMap<String, P4GDataDto> p4GDataMap = new HashMap<>();

    public P4GDataDto getData(String user) {
        synchronized (p4GDataMap) {
            if ("ALL".equals(user)) {
                P4GDataDto allUsers = new P4GDataDto();
                for (P4GDataDto singleUser : p4GDataMap.values()) {
                    allUsers.setPlex(allUsers.getPlex() + singleUser.getPlex());
                    allUsers.setmIsk(allUsers.getmIsk() + singleUser.getmIsk());
                }
                return allUsers;
            } else {
                P4GDataDto specificUser = p4GDataMap.get(user);
                if (specificUser == null) {
                    specificUser = new P4GDataDto();
                    specificUser.setUser(user);
                    p4GDataMap.put(user, specificUser);
                }
                return specificUser;
            }
        }
    }

    public P4GDataDto registerData(P4GDataDto data) {
        p4GDataMap.put(data.getUser(), data);
        return (getData("ALL"));
    }
}
