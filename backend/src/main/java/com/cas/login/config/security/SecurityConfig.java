package com.cas.login.config.security;

import com.cas.login.config.CookieLoggingFilter;
import com.cas.login.service.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;
import org.springframework.core.annotation.Order;


/**
 * Configuración de seguridad modularizada para la aplicación.
 * Esta clase configura Spring Security con dos cadenas de filtros separadas:
 * - Una para endpoints de API (/api/**)
 * - Otra para autenticación por formularios
 * 
 * La configuración utiliza clases auxiliares para mantener el código organizado:
 * - SecurityRoles: constantes de roles
 * - SecurityEndpoints: configuración de permisos por endpoint
 * - SecurityHandlers: manejadores de eventos de autenticación
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private SecurityHandlers securityHandlers;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }   
    
    @Bean
    @Order(1) // API specific configuration (incluye login)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        // Initialize security handlers
        if (securityHandlers == null) {
            securityHandlers = new SecurityHandlers(objectMapper);
        }

        http
            .securityMatcher("/api/**") // Aplica solo a /api/**
            .authorizeHttpRequests(SecurityEndpoints::configureApiEndpoints)
            .formLogin(formLogin ->
                formLogin
                    .loginProcessingUrl("/api/login") // Login bajo /api/login
                    .successHandler(securityHandlers.createSuccessHandler())
                    .failureHandler(securityHandlers.createFailureHandler())
                    .permitAll()
            )
            .logout(logout ->
                logout
                    .logoutUrl("/api/logout")
                    .logoutSuccessHandler(SecurityHandlers::handleLogoutSuccess)
                    .permitAll()
            )
            .httpBasic(customizer -> {}) // Permite HTTP Basic para compatibilidad
            .csrf(csrf -> csrf.disable()) // Deshabilita CSRF para APIs stateless
            .addFilterAfter(new CookieLoggingFilter(), org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(eh -> eh
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .authenticationProvider(authenticationProvider());

        return http.build();
    }

    // Eliminado formLoginFilterChain: toda la autenticación y login se maneja bajo /api/**
