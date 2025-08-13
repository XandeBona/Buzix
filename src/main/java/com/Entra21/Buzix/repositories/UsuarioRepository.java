package com.Entra21.Buzix.repositories;

import com.Entra21.Buzix.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<User, Integer> {
    public Optional<User> findByEmail(String email);
}
