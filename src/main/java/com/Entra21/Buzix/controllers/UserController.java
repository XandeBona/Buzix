package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.UserRequestDTO;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.stream.Collectors;
import com.Entra21.Buzix.entities.User;
import com.Entra21.Buzix.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //Busca todos
    @GetMapping
    public List<User> listarUsuarios() {
        return this.userRepository.findAll();
    }

    //Busca o usuário que está logado
    @GetMapping("/me")
    public User currentUser(Authentication authentication) {
        return this.userRepository.findByEmail(authentication.getName()).orElseThrow();
    }

    //Registra o usuário e valida e-mail
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult result) {
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

    //Edita o usuário que está logado
    @PutMapping("/me")
    public ResponseEntity<?> updateUserData(@RequestBody UserRequestDTO request, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        //Valida o novo e-mail informado pelo usuário
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("E-mail já está em uso.");
        }

        //Valida se a senha atual está correta
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Senha atual incorreta.");
        }

        //Atualiza nome e email
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());

        //Atualiza senha (se for informada)
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPassword(encoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        //Sempre pede para relogar após as mudanças
        return ResponseEntity.ok("Dados atualizados. Faça login novamente.");
    }
}
