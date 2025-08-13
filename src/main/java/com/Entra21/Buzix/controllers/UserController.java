package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.entities.User;
import com.Entra21.Buzix.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping()
    public List<User> listarUsuarios() {
        return this.userRepository.findAll();
    }

    @GetMapping("/me")
    public User usuarioLogado(Authentication authentication) {
        return this.userRepository.findByEmail(authentication.getName()).orElseThrow();
    }
}
