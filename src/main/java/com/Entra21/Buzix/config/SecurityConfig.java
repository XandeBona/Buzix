package com.Entra21.Buzix.config;

import com.Entra21.Buzix.filters.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .requestMatchers("/auth/login", "/auth/register", "/auth/logout",
                        "/html/alterar_senha.html",
                        "/html/cadastro.html",
                        "/html/login.html",
                        "/index.html",
                        "/js/**",
                        "/css/**",
                        "/IMAGES/**",
                        "/favicon.ico"
                ).permitAll()

                .requestMatchers(HttpMethod.GET, "/busstops/**", "/routes/**", "/trips/**", "/stoptimes/**", "/vehicles/**", "/api/route").permitAll()

                //Somente admins(empresas) podem acessar
                .requestMatchers("/html/empresa.html",
                        "/html/ponto.html", "/html/veiculo.html",
                        "/html/linha.html", "/html/itinerario.html", "/html/parada.html",
                        "/html/gerenciar_ponto.html", "/html/gerenciar_veiculo.html",
                        "/html/gerenciar_linha.html", "/html/gerenciar_itinerario.html",
                        "/html/gerenciar_parada.html"
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
