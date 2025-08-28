package com.Entra21.Buzix.services;

import com.Entra21.Buzix.entities.User;
import com.Entra21.Buzix.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //Para validar se o e-mail já está sendo utilizado
    public User newUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado!");
        }
        return userRepository.save(user);
    }
}