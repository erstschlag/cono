package net.erstschlag.playground.twitch.user.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<UserEntity, String> {
    Page<UserEntity> findAllByOrderByShillingsDesc(Pageable pageable);
    UserEntity save(UserEntity entity);
    Page<UserEntity> findAll();
    void deleteById(String id);
    Optional<UserEntity> findById(String id);
}
