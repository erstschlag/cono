package net.erstschlag.playground.user.repository;

import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<UserEntity, String> {
    Page<UserEntity> findAllByOrderByNuggetsDesc(Pageable pageable);
    UserEntity save(UserEntity entity);
    Collection<UserEntity> findAll();
    void deleteById(String id);
    Optional<UserEntity> findById(String id);
}
