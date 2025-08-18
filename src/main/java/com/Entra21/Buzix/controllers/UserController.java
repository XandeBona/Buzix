package com.Entra21.Buzix.controllers;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.stream.Collectors;
import com.Entra21.Buzix.entities.User;
import com.Entra21.Buzix.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping
    public List<User> listarUsuarios() {
        return this.userRepository.findAll();
    }

    @GetMapping("/me")
    public User usuarioLogado(Authentication authentication) {
        return this.userRepository.findByEmail(authentication.getName()).orElseThrow();
    }

    // Novo endpoint com validação de e-mail
    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            String mensagemErro = result.getFieldErrors().stream()
                    .map(e -> e.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(mensagemErro);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado.");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(user.getPassword()));

        User novoUsuario = userRepository.save(user);
        return ResponseEntity.ok(novoUsuario);
    }

}
