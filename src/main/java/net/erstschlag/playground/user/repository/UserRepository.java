package net.erstschlag.playground.user.repository;

import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends PagingAndSortingRepository<UserEntity, String> {

    Page<UserEntity> findAllByOrderByNuggetsDesc(Pageable pageable);

    UserEntity save(UserEntity entity);

    Collection<UserEntity> findAll();

    void deleteById(String id);

    Optional<UserEntity> findById(String id);

    Page<UserEntity> findByNameLike(String name, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "UPDATE twitch_user set weekly_lp = 0", nativeQuery = true)
    void resetWeeklyLP();
    
    @Query(value = "SELECT SUM(weekly_lp) FROM twitch_user", nativeQuery = true)
    Long sumWeeklyLP();

    @Query(value = "SELECT count(*) + 1 from twitch_user where weekly_lp > (SELECT weekly_lp from twitch_user where id = :userId)", nativeQuery = true)
    Integer userWeeklyLPRank(@Param("userId") String userId);
}
