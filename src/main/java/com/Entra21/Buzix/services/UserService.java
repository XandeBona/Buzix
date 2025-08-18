package com.Entra21.Buzix.services;

import com.Entra21.Buzix.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this. repository = repository;
    }

    public boolean emailExiste(String email) {
        return repository.existsByEmail(email);
    }
}
