package net.erstschlag.playground.twitch.pubsub;

import com.github.twitch4j.common.enums.SubscriptionPlan;

public enum SubTier {
    NONE(0),
    PRIME(1),
    T1(1),
    T2(2),
    T3(3);
    private final int tier;

    SubTier(int tier) {
        this.tier = tier;
    }

    public static SubTier fromSubPlan(SubscriptionPlan subPlan) {
        switch (subPlan) {
            case NONE -> {
                return NONE;
            }
            case TWITCH_PRIME -> {
                return PRIME;
            }
            case TIER1 -> {
                return T1;
            }
            case TIER2 -> {
                return T2;
            }
            case TIER3 -> {
                return T3;
            }
            default ->
                throw new AssertionError(subPlan.name());

        }
    }
    
    public static SubTier fromSubPlanString(String subPlan) {
        switch (subPlan) {
            case "Prime" -> {
                return PRIME;
            }
            case "1000" -> {
                return T1;
            }
            case "2000" -> {
                return T2;
            }
            case "3000" -> {
                return T3;
            }
            default ->
                throw new AssertionError(subPlan);

        }
    }

    public int getTier() {
        return tier;
    }

}
