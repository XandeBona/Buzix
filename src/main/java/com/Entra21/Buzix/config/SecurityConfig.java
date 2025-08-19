package com.Entra21.Buzix.config;

import com.Entra21.Buzix.filters.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf().disable()
                .authorizeHttpRequests()

                //Visitante e usuários logados podem acessar
                .requestMatchers("/auth/login", "/auth/register", "/auth/logout", "/alterar_senha.html",
                        "/cadastro.html", "/cadastro.js",
                        "/login.html", "/login.js",
                        "/index.html", "/index.js", "/index.css",
                        "/js/**",
                        "/css/**",
                        "/IMAGES/**",
                        "/favicon.ico",
                        "/busstops/all"
                ).permitAll()

                //Somente admins(empresas) podem acessar
                .requestMatchers("/empresa.html",
                        "/ponto.html", "/gerenciar_ponto.html", "/gerenciar_veiculo.html", "/veiculo.html", "/linha.html", "/itinerario.html"
                ).hasRole("ADMIN")

                .anyRequest().authenticated()
                .and()
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
