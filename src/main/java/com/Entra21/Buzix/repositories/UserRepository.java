package com.Entra21.Buzix.repositories;

import com.Entra21.Buzix.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    public Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
