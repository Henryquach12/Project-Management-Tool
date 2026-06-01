package com.projet_managment.backend.repository;

import com.projet_managment.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    List<User> findByEmailContainingIgnoreCaseOrUsernameContainingIgnoreCase(String email, String username);
}
