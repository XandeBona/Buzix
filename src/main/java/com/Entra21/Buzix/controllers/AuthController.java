package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.LoginRequestDTO;
import com.Entra21.Buzix.dtos.LoginResponseDTO;
import com.Entra21.Buzix.dtos.RegisterResponseDTO;
import com.Entra21.Buzix.entities.User;
import com.Entra21.Buzix.repositories.UserRepository;
import com.Entra21.Buzix.services.JWTService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, UserDetailsService userDetailsService, JWTService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public RegisterResponseDTO createUser (@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");
        User saved = userRepository.save(user);
        return new RegisterResponseDTO(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login (@RequestBody LoginRequestDTO request,
                                                  HttpServletResponse response) {
        UserDetails user = userDetailsService.loadUserByUsername(request.email);

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new BadCredentialsException("Senha inválida");
        }

        String token = jwtService.generateToken(user);

        //cria cookie HttpOnly
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // true se um dia for usar HTTPS
                .path("/")
                .maxAge(60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        String role = user.getAuthorities().stream()
                .findFirst()
                .get()
                .getAuthority();

        //devolve DTO sem expor o token
        return ResponseEntity.ok(new LoginResponseDTO(user.getUsername(), role));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout (HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true se um dia for usar HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.noContent().build();
    }
}
