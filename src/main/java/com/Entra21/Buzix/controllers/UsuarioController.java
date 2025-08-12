package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.entities.Usuario;
import com.Entra21.Buzix.repositories.UsuarioRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping()
    public List<Usuario> listarUsuarios() {
        return this.usuarioRepository.findAll();
    }

    @GetMapping("/me")
    public Usuario usuarioLogado(Authentication authentication) {
        return this.usuarioRepository.findByEmail(authentication.getName()).orElseThrow();
    }
}
